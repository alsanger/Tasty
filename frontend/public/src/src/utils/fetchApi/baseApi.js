// baseApi.js
import { API_BASE_URL } from '../constants';

// Функция для формирования заголовков запроса
const getHeaders = (contentType = 'application/json') => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': contentType,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

// GET запрос
export const get = async (endpoint, params = {}) => {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
            url.searchParams.append(key, params[key]);
        }
    });

    try {
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: getHeaders(),
        });
        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || `Ошибка: ${response.status}`);
        }

        return responseData;
    } catch (error) {
        console.error('Ошибка при выполнении GET-запроса:', error);
        throw error;
    }
};

// POST запрос
export const post = async (endpoint, data, isFormData = false) => {
    try {
        const headers = isFormData ? getHeaders(undefined) : getHeaders();
        const body = isFormData ? data : JSON.stringify(data);

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: headers,
            body: body,
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || `Ошибка: ${response.status}`);
        }

        return responseData;
    } catch (error) {
        console.error('Ошибка при выполнении POST-запроса:', error);
        throw error;
    }
};

// PUT запрос
export const put = async (endpoint, data, isFormData = false) => {
    try {
        const headers = isFormData ? getHeaders(undefined) : getHeaders();
        const body = isFormData ? data : JSON.stringify(data);

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: headers,
            body: body,
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || `Ошибка: ${response.status}`);
        }

        return responseData;
    } catch (error) {
        console.error('Ошибка при выполнении PUT-запроса:', error);
        throw error;
    }
};

// DELETE запрос
export const remove = async (endpoint, data = null) => {
    try {
        const options = {
            method: 'DELETE',
            headers: getHeaders(),
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || `Ошибка: ${response.status}`);
        }

        return responseData;
    } catch (error) {
        console.error('Ошибка при выполнении DELETE-запроса:', error);
        throw error;
    }
};

// Специальный метод для загрузки файлов
export const uploadFile = async (endpoint, file, data = {}) => {
    const formData = new FormData();
    formData.append('image', file);

    // Добавляем остальные данные в formData
    Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key]);
        }
    });

    return post(endpoint, formData, true);
};
