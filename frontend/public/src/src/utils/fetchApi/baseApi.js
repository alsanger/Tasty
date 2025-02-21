import { API_BASE_URL } from '../constants';

/**
 * Выполняет GET-запрос к API.
 * @param {string} endpoint - Эндпоинт API.
 * @param {Object} params - Параметры запроса (опционально).
 * @returns {Promise} - Промис с результатом запроса.
 */
export const get = async (endpoint, params = {}) => {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    try {
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при выполнении GET-запроса:', error);
        throw error;
    }
};

/**
 * Выполняет POST-запрос к API.
 * @param {string} endpoint - Эндпоинт API.
 * @param {Object} data - Данные для отправки.
 * @returns {Promise} - Промис с результатом запроса.
 */
export const post = async (endpoint, data) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при выполнении POST-запроса:', error);
        throw error;
    }
};

/**
 * Выполняет PUT-запрос к API.
 * @param {string} endpoint - Эндпоинт API.
 * @param {Object} data - Данные для отправки.
 * @returns {Promise} - Промис с результатом запроса.
 */
export const put = async (endpoint, data) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при выполнении PUT-запроса:', error);
        throw error;
    }
};

/**
 * Выполняет DELETE-запрос к API.
 * @param {string} endpoint - Эндпоинт API.
 * @returns {Promise} - Промис с результатом запроса.
 */
export const remove = async (endpoint) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при выполнении DELETE-запроса:', error);
        throw error;
    }
};