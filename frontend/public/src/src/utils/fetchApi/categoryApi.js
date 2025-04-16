// Файл utils/fetchApi/categoryApi.js
import { get, post, put, remove } from './baseApi.js';
import { ENDPOINTS } from '../constants.js';

// CRUD операции для категорий

// Получение списка категорий
export const getCategories = async (params = {}) => {
    return get(ENDPOINTS.CATEGORIES, params);
};

// Получение одной категории по ID
export const getCategoryById = async (categoryId) => {
    return get(ENDPOINTS.CATEGORY_DETAIL(categoryId));
};

// Создание категории
export const createCategory = async (categoryData) => {
    return post(ENDPOINTS.CREATE_CATEGORY, categoryData);
};

// Обновление категории
export const updateCategory = async (categoryId, categoryData) => {
    return put(ENDPOINTS.UPDATE_CATEGORY(categoryId), categoryData);
};

// Удаление категории
export const deleteCategory = async (categoryId) => {
    return remove(ENDPOINTS.DELETE_CATEGORY(categoryId));
};