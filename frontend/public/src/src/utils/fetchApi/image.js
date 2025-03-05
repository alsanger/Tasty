//image.js
import {remove, uploadFile} from './baseApi';
import {ENDPOINTS} from '../constants';

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
