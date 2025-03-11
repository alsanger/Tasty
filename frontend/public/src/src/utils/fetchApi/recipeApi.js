// Файл recipeApi.js
import { get, post, put, remove } from './baseApi.js';
import { ENDPOINTS } from '../constants.js';

// Получение списка рецептов
export const getRecipes = async (params = {}) => {
    return get(ENDPOINTS.RECIPES, params);
};

// Получение одного рецепта по ID
export const getRecipeById = async (recipeId) => {
    return get(ENDPOINTS.RECIPE_DETAIL(recipeId));
};

// Создание рецептов
export const createRecipe = async (recipeData) => {
    return post(ENDPOINTS.CREATE_RECIPE, recipeData);
};

// Обновление рецептов
export const updateRecipe = async (recipeId, recipeData) => {
    return put(ENDPOINTS.UPDATE_RECIPE(recipeId), recipeData);
};

// Удаление рецептов
export const deleteRecipe = async (recipeId) => {
    return remove(ENDPOINTS.DELETE_RECIPE(recipeId));
};

// Получение топ рецепта за день
export const getTopDayRecipeRecipes = async (params = {}) => {
    return get(ENDPOINTS.TOP_DAY_RECIPE, params);
};

// Получение топ рецепта за неделю
export const getTopWeekRecipeRecipes = async (params = {}) => {
    return get(ENDPOINTS.TOP_WEEK_RECIPE, params);
};

// Получение топ рецепта за месяц
export const getTopMonthRecipeRecipes = async (params = {}) => {
    return get(ENDPOINTS.TOP_MONTH_RECIPE, params);
};

// Получение новых рецептов
export const getNewRecipes = async (params = {}) => {
    return get(ENDPOINTS.NEW_RECIPES, params);
};

// Получение популярных рецептов
export const getPopularRecipes = async (params = {}) => {
    return get(ENDPOINTS.BEST_RECIPES, params);
};

// Поиск рецептов
export const searchRecipes = async (queryParams = {}) => {
    return get(ENDPOINTS.SEARCH_RECIPES, queryParams);
};

// Получение рецептов пользователя по ID пользователя
export const getUserRecipes = async (userId, params = {}) => {
    return get(ENDPOINTS.USER_RECIPES(userId), params);
};
