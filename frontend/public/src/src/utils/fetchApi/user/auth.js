import { post } from '../baseApi';
import { ENDPOINTS } from '../../constants';

/**
 * Логинит пользователя.
 * @param {Object} credentials - Данные для входа (email, password).
 * @returns {Promise} - Промис с результатом входа.
 */
/*export const login = async (credentials) => {
console.log('Sending login request with credentials:', credentials);
    return post(ENDPOINTS.LOGIN, credentials);
};*/
export const login = async (credentials) => {
console.log('Sending login request with credentials:', credentials);
    try {
        const response = await post(ENDPOINTS.LOGIN, credentials);
console.log('Login API response:', response);
        return response;
    } catch (error) {
console.error('Login API error:', error);
        throw error;
    }
};

/**
 * Регистрирует нового пользователя.
 * @param {Object} userData - Данные пользователя.
 * @returns {Promise} - Промис с результатом регистрации.
 */
export const register = async (userData) => {
    return post(ENDPOINTS.REGISTER, userData);
};

/**
 * Выходит из системы (если требуется).
 * @returns {Promise} - Промис с результатом выхода.
 */
export const logout = async () => {
    // Если на бэкенде есть эндпоинт для выхода, используйте его.
    // Например: return post(ENDPOINTS.LOGOUT);
    localStorage.removeItem('token'); // Очищаем токен из localStorage
    localStorage.removeItem('user'); // Очищаем данные пользователя
};