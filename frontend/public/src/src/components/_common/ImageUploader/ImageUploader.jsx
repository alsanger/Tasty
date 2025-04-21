//Файл ImageUploader.jsx:
import React, {useState, useRef} from 'react';
import {Alert, Spinner, Image} from 'react-bootstrap';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import {uploadImage, uploadImageForRecipeStep} from '../../../utils/fetchApi/image';
import './ImageUploader.scss';

const ImageUploader = ({
                           endpoint,
                           id,
                           recipeId = null, // Для RecipeStep
                           currentImageUrl = null,
                           onImageUpdate = () => {
                           },
                           button = {}
                       }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [imageUrl, setImageUrl] = useState(currentImageUrl);
    const fileInputRef = useRef(null);

    // Настройки кнопки по умолчанию, если не переданы
    const defaultButtonProps = {
        text: 'Завантажити',
        variant: 'default',
        type: 'button'
    };

    // Объединяем дефолтные и переданные пропсы для кнопки
    const buttonProps = {...defaultButtonProps, ...button};

    // Функция для открытия диалога выбора файла
    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleUpload(e.target.files[0]);
        } else {
            console.log('Действие: Файл не выбран');
        }
    };

    const handleUpload = async (file) => {
        if (!file) {
            console.log('Действие: Файл не передан');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log('Действие: Загрузка файла начата —', file.name);
            const response = (recipeId) ?
                await uploadImageForRecipeStep(file, endpoint, id, recipeId) :
                await uploadImage(file, endpoint, id);

            if (response && response.image_url) {
                setImageUrl(response.image_url);
                onImageUpdate(response.image_url);
            } else {
                console.log('URL изображения не получен');
                throw new Error('Не вдалося отримати URL зображення');
            }
        } catch (err) {
            console.log('Ошибка при загрузке файла —', err.message);
            setError(err.message || 'Помилка при завантаженні зображення');
        } finally {
            setLoading(false);
        }
    };

    // Создаем модифицированный текст для кнопки с учетом состояния загрузки
    const buttonText = loading ? (
        <>
            <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
            />
            Завантаження...
        </>
    ) : buttonProps.text;

    return (
        <div className="image-uploader">
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Скрытый input для выбора файла */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{display: 'none'}}
                disabled={loading}
            />

            {/* Изображение, если оно загружено */}
            {imageUrl && (
                <div className="image-preview">
                    <Image
                        src={imageUrl}
                        alt="Preview"
                        thumbnail
                        className="uploaded-image"
                    />
                </div>
            )}

            {/* Кнопка для загрузки изображения */}
            <Button
                {...buttonProps}
                text={buttonText}
                onClick={handleButtonClick}
                disabled={loading}
            />
        </div>
    );
};

ImageUploader.propTypes = {
    endpoint: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    recipeId: PropTypes.number,
    currentImageUrl: PropTypes.string,
    onImageUpdate: PropTypes.func,
    button: PropTypes.object
};

export default ImageUploader;
