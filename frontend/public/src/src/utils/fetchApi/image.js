//image.js
import {downloadFile, remove, uploadFile} from './baseApi';
import {ENDPOINTS} from '../constants';

// Получение изображений
export const getImage = async (imageUrl) => {
    try {
        return await downloadFile(ENDPOINTS.IMAGE.GET, { url: imageUrl });
    } catch (error) {
        console.error('Ошибка получения изображения:', error);
        return null;
    }
};

// Загрузка изображения
export const uploadImage = async (file, type, id, recipeStepId = null) => {
    const data = {
        type,
        id
    };

    if (recipeStepId) {
        data.recipe_step_id = recipeStepId;
    }

    return await uploadFile(ENDPOINTS.IMAGE.UPLOAD, file, data);
};

// Удаление изображения
export const deleteImage = async (imagePath) => {
    return await remove(ENDPOINTS.IMAGE.DELETE, { image_path: imagePath });
};
