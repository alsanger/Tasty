import { get, uploadFile, remove } from './baseApi';
import { ENDPOINTS } from '../constants';

// Получение изображений
export const getImages = async (type, id, recipeStepId = null) => {
    return await get(ENDPOINTS.IMAGE.GET, {
        type,
        id,
        recipe_step_id: recipeStepId
    });
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
