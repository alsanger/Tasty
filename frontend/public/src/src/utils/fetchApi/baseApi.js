// Файл utils/fetchApi/baseApi.js:
import { API_BASE_URL } from '../constants';
import axios from 'axios';

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
        let headers = {};

        if (isFormData) {
            // Для FormData не указываем Content-Type,
            // чтобы браузер сам установил правильный заголовок с boundary
            const token = localStorage.getItem('token');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        } else {
            // Для обычных JSON-запросов используем стандартные заголовки
            headers = getHeaders();
        }

        const body = isFormData ? data : JSON.stringify(data);

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: headers,
            body: body,
        });
        console.log('POST', response);

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
    try {
        const formData = new FormData();
        formData.append('image', file);

        // Добавляем остальные данные в formData
        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });

        // Получаем токен из localStorage
        const token = localStorage.getItem('token');

        const response = await axios.post(`${API_BASE_URL}${endpoint}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Ошибка при загрузке файла:', error);
        throw new Error(error.response?.data?.message || `Ошибка: ${error.response?.status}`);
    }
};
