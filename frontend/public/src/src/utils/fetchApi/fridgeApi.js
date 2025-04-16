// Файл utils/fetchApi/fridgeApi.js
import { get, post, put, remove } from './baseApi.js';
import { ENDPOINTS } from '../constants.js';

// Получение списка холодильников
export const getFridges = async (params = {}) => {
    return get(ENDPOINTS.FRIDGES, params);
};

// Получение одного холодильника по ID
export const getFridgeById = async (fridgeId) => {
    return get(ENDPOINTS.FRIDGE_DETAIL(fridgeId));
};

// Создание нового холодильника
export const createFridge = async (fridgeData) => {
    return post(ENDPOINTS.CREATE_FRIDGE, fridgeData);
};

// Обновление холодильника
export const updateFridge = async (fridgeId, fridgeData) => {
    return put(ENDPOINTS.UPDATE_FRIDGE(fridgeId), fridgeData);
};

// Удаление холодильника
export const deleteFridge = async (fridgeId) => {
    return remove(ENDPOINTS.DELETE_FRIDGE(fridgeId));
};

// Получение холодильника по ID пользователя
export const getFridgeByUser = async (userId) => {
    return get(ENDPOINTS.USER_FRIDGE(userId));
};
