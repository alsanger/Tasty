// Файл utils/fetchApi/cookingMethodApi.js
import { get, post, put, remove } from './baseApi.js';
import { ENDPOINTS } from '../constants.js';

// Получение списка способов приготовления
export const getCookingMethods = async () => {
    return get(ENDPOINTS.COOKING_METHODS);
};

// Получение способа приготовления по ID
export const getCookingMethodById = async (cookingMethodId) => {
    return get(ENDPOINTS.COOKING_METHOD_DETAIL(cookingMethodId));
};

// Создание способа приготовления
export const createCookingMethod = async (cookingMethodData) => {
    return post(ENDPOINTS.CREATE_COOKING_METHOD, cookingMethodData);
};

// Обновление способа приготовления
export const updateCookingMethod = async (cookingMethodId, cookingMethodData) => {
    return put(ENDPOINTS.UPDATE_COOKING_METHOD(cookingMethodId), cookingMethodData);
};

// Удаление способа приготовления
export const deleteCookingMethod = async (cookingMethodId) => {
    return remove(ENDPOINTS.DELETE_COOKING_METHOD(cookingMethodId));
};