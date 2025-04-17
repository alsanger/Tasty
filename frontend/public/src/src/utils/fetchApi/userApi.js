// Файл utils/fetchApi/userApi.js
import {get, post, put, remove} from './baseApi.js';
import {ENDPOINTS} from '../constants.js';

// CRUD операции
// Создание пользователя (уже есть в примере как register)
export const register = async (userData) => {
    return await post(ENDPOINTS.REGISTER, userData);
};

// Получение списка пользователей
export const getUsers = async (params = {}) => {
    return get(ENDPOINTS.USERS, params);
};

// Получение одного пользователя по ID
export const getUserById = async (userId) => {
    return get(ENDPOINTS.USER_DETAIL(userId));
};

// Обновление пользователя
export const updateUser = async (userId, userData) => {
    return put(ENDPOINTS.USER_UPDATE(userId), userData);
};

// Удаление пользователя
export const deleteUser = async (userId) => {
    return remove(ENDPOINTS.USER_DELETE(userId));
};

// Дополнительные методы, связанные с пользователем
// Аутентификация
export const login = async (credentials) => {
    return await post(ENDPOINTS.LOGIN, credentials);
};

// Выход из системы
export const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// Получение ролей пользователя
export const getUserRoles = async (userId) => {
    return get(ENDPOINTS.USER_ROLES(userId));
};

// Получение подписчиков пользователя
export const getUserFollowers = async (userId, params = {}) => {
    return get(ENDPOINTS.USER_FOLLOWERS(userId), params);
};

// Получение подписок пользователя
export const getUserFollowing = async (userId, params = {}) => {
    return get(ENDPOINTS.USER_FOLLOWING(userId), params);
};

// Подписка на пользователя
export const followUser = async (userId) => {
    return post(ENDPOINTS.USER_FOLLOW, {user_id: userId});
};

// Отписка от пользователя
export const unfollowUser = async (userId) => {
    return post(ENDPOINTS.USER_UNFOLLOW, {user_id: userId});
};

// Получение текущего аутентифицированного пользователя
export const getCurrentUser = () => {
    const userString = localStorage.getItem('user');
    if (userString) {
        try {
            return JSON.parse(userString);
        } catch (e) {
            console.error('Error parsing user from localStorage:', e);
            return null;
        }
    }
    return null;
};

// Сохранение данных пользователя и токена после авторизации
export const saveUserData = (userData, token) => {
    if (token) {
        localStorage.setItem('token', token);
    }
    if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
    }
};