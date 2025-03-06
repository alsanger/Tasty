//Файл image.js:
import {remove, uploadFile} from './baseApi';
import {ENDPOINTS} from '../constants';

// Загрузка изображения
export const uploadImage = async (file, endpoint, id) => {
    const data = { id };

    return await uploadFile(endpoint, file, data);
};

// Удаление изображения
export const deleteImage = async (imagePath) => {
    return await remove(ENDPOINTS.IMAGE.DELETE, { image_path: imagePath });
};
