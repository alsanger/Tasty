// Файл utils/fetchApi/likeApi.js
import { get, post, put, remove } from './baseApi.js';
import { ENDPOINTS } from '../constants.js';

// CRUD операции для лайков

// Получение списка лайков
export const getLikes = async (params = {}) => {
    return get(ENDPOINTS.LIKES, params);
};

// Получение списка лайков конкретного рецепта по id
export const getLikesByRecipeId = async (recipeId) => {
    return get(ENDPOINTS.LIKES_BY_RECIPE(recipeId));
};

// Получение одного лайка по ID
export const getLikeById = async (likeId) => {
    return get(ENDPOINTS.LIKES_DETAIL(likeId));
};

// Создание лайка
export const createLike = async (likeData) => {
    return post(ENDPOINTS.CREATE_LIKE, likeData);
};

// Удаление лайка
export const deleteLike = async (likeId) => {
    return remove(ENDPOINTS.DELETE_LIKE(likeId));
};