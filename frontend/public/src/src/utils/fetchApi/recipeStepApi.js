// Файл utils/fetchApi/recipeStepApi.js
import { get, post, put, remove, uploadFile } from './baseApi.js';
import { ENDPOINTS } from '../constants.js';

// Получение списка шагов рецепта
export const getRecipeSteps = async (recipeId) => {
    return get(ENDPOINTS.RECIPE_STEPS(recipeId));
};

// Получение одного шага рецепта по ID
export const getRecipeStepById = async (recipeStepId) => {
    return get(ENDPOINTS.RECIPE_STEP_DETAIL(recipeStepId));
};

// Создание шага рецепта
export const createRecipeStep = async (recipeStepData) => {
    return post(ENDPOINTS.CREATE_RECIPE_STEP, recipeStepData);
};

// Обновление шага рецепта
export const updateRecipeStep = async (recipeStepId, recipeStepData) => {
    return put(ENDPOINTS.UPDATE_RECIPE_STEP(recipeStepId), recipeStepData);
};

// Удаление шага рецепта
export const deleteRecipeStep = async (recipeStepId) => {
    return remove(ENDPOINTS.DELETE_RECIPE_STEP(recipeStepId));
};

// Загрузка изображения для шага рецепта
export const uploadRecipeStepImage = async (recipeStepId, imageFile) => {
    return uploadFile(ENDPOINTS.UPLOAD_RECIPE_STEP_IMAGE, imageFile, { recipe_step_id: recipeStepId });
};