import { useState, useEffect } from "react";
import { imageApi } from "../../../src/utils/fetchApi";

const ImageUploader = ({ type, id, recipeStepId }) => {
    const [image, setImage] = useState(null);
    const [imageUrls, setImageUrls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchImages();
    }, [type, id, recipeStepId]);

    const fetchImages = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await imageApi.getImages(type, id, recipeStepId);
            setImageUrls(response.images || []);
        } catch (error) {
            console.error("Ошибка при получении изображений", error);
            setError("Не удалось загрузить изображения");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (event) => {
        setImage(event.target.files[0]);
    };

    const uploadImage = async () => {
        if (!image) {
            alert("Выберите файл!");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await imageApi.uploadImage(image, type, id, recipeStepId);
            alert("Файл загружен!");
            setImage(null);
            fetchImages();
        } catch (error) {
            console.error("Ошибка при загрузке", error);
            setError("Не удалось загрузить файл");
            alert("Ошибка при загрузке");
        } finally {
            setLoading(false);
        }
    };

    const deleteImage = async (imageUrl) => {
        setLoading(true);
        setError(null);
        try {
            await imageApi.deleteImage(imageUrl);
            setImageUrls(imageUrls.filter((url) => url !== imageUrl));
            alert("Файл удален!");
        } catch (error) {
            console.error("Ошибка при удалении", error);
            setError("Не удалось удалить файл");
            alert("Ошибка при удалении");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                disabled={loading}
            />
            <button
                onClick={uploadImage}
                disabled={!image || loading}
            >
                {loading ? "Загрузка..." : "Загрузить"}
            </button>

            {error && <p style={{color: 'red'}}>{error}</p>}

            {imageUrls.length > 0 && (
                <div>
                    <h3>Загруженные изображения:</h3>
                    {imageUrls.map((url, index) => (
                        <div key={index} style={{marginBottom: '10px'}}>
                            <img src={url} alt="Загруженное" width="200" />
                            <button
                                onClick={() => deleteImage(url)}
                                disabled={loading}
                                style={{marginLeft: '10px'}}
                            >
                                Удалить
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageUploader;