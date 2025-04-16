// Файл utils/fetchApi/cookingPlanApi.js
import { get, post, put, remove } from './baseApi.js';
import { ENDPOINTS } from '../constants.js';

// CRUD операции для планов приготовления еды

// Получение списка планов приготовления
export const getCookingPlans = async (params = {}) => {
    return get(ENDPOINTS.COOKING_PLANS, params);
};

// Получение одного плана приготовления по ID
export const getCookingPlanById = async (planId) => {
    return get(ENDPOINTS.COOKING_PLAN_DETAIL(planId));
};

// Создание нового плана приготовления
export const createCookingPlan = async (planData) => {
    return post(ENDPOINTS.CREATE_COOKING_PLAN, planData);
};

// Обновление плана приготовления
export const updateCookingPlan = async (planId, planData) => {
    return put(ENDPOINTS.UPDATE_COOKING_PLAN(planId), planData);
};

// Удаление плана приготовления
export const deleteCookingPlan = async (planId) => {
    return remove(ENDPOINTS.DELETE_COOKING_PLAN(planId));
};

// Получение планов приготовления для конкретного пользователя
export const getUserCookingPlans = async (userId, params = {}) => {
    return get(ENDPOINTS.USER_COOKING_PLAN(userId), params);
};
