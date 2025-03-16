//Файл image.js:
import {remove, uploadFile} from './baseApi';
import {ENDPOINTS} from '../constants';

// Загрузка изображения
export const uploadImage = async (file, endpoint, id) => {
    const data = { id };

    return await uploadFile(endpoint, file, data);
};

export const uploadImageForRecipeStep = async (file, endpoint, id, recipe_id) => {
    const data = { id, recipe_id };

    return await uploadFile(endpoint, file, data);
};

// Удаление изображения
export const deleteImage = async (imagePath) => {
    return await remove(ENDPOINTS.IMAGE.DELETE, { image_path: imagePath });
};
