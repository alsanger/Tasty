import React, { useState, useRef } from 'react';
import { Alert, Spinner, Image } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import { uploadImage, deleteImage } from '../../../utils/fetchApi/image';
import './ImageUploader.scss';

const ImageUploader = ({
                           type,
                           id,
                           recipeStepId = null,
                           currentImageUrl = null,
                           onImageUpdate = () => {},
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
    const buttonProps = { ...defaultButtonProps, ...button };

    // Логирование пропсов кнопки
    console.log('Должно быть: buttonProps — { text: "Вибрати фото", icon: CameraIcon, variant: "default" }');
    console.log('По факту: buttonProps —', buttonProps);

    // Функция для открытия диалога выбора файла
    const handleButtonClick = () => {
        console.log('Действие: Кнопка нажата, открыт диалог выбора файла');
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            console.log('Действие: Файл выбран —', e.target.files[0].name);
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
            const response = await uploadImage(file, type, id, recipeStepId);
            if (response && response.image_url) {
                console.log('Должно быть: URL изображения — строка (например, "http://example.com/image.jpg")');
                console.log('По факту: URL изображения —', response.image_url);
                setImageUrl(response.image_url);
                onImageUpdate(response.image_url);
            } else {
                console.log('По факту: URL изображения не получен');
                throw new Error('Не вдалося отримати URL зображення');
            }
        } catch (err) {
            console.log('По факту: Ошибка при загрузке файла —', err.message);
            setError(err.message || 'Помилка при завантаженні зображення');
        } finally {
            console.log('Действие: Загрузка завершена');
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!imageUrl) {
            console.log('Действие: Нет изображения для удаления');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log('Действие: Удаление изображения начато —', imageUrl);
            await deleteImage(imageUrl);
            console.log('Действие: Изображение удалено');
            setImageUrl(null);
            onImageUpdate(null);
        } catch (err) {
            console.log('По факту: Ошибка при удалении изображения —', err.message);
            setError(err.message || 'Помилка при видаленні зображення');
        } finally {
            console.log('Действие: Удаление завершено');
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

    // Логирование состояния кнопки
    console.log('Должно быть: Текст кнопки — "Вибрати фото"');
    console.log('По факту: Текст кнопки —', buttonText);

    return (
        <div className="image-uploader">
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Скрытый input для выбора файла */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
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
    type: PropTypes.oneOf(['avatar', 'avatars', 'category', 'categories', 'recipe', 'recipes']).isRequired,
    id: PropTypes.number.isRequired,
    recipeStepId: PropTypes.number,
    currentImageUrl: PropTypes.string,
    onImageUpdate: PropTypes.func,
    button: PropTypes.object
};

export default ImageUploader;