// Файл utils/fetchApi/ingredientApi.js
import { get } from './baseApi.js';
import { ENDPOINTS } from '../constants.js';

// Получение списка ингредиентов
export const getIngredients = async () => {
    return get(ENDPOINTS.INGREDIENTS);
};

// Получение ингредиента по ID
export const getIngredientById = async (ingredientId) => {
    return get(ENDPOINTS.INGREDIENT_DETAIL(ingredientId));
};