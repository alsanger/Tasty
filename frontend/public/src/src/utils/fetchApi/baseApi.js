import { API_BASE_URL } from '../constants';

// Функция для формирования заголовков запроса
// Автоматически добавляет токен из localStorage, если он есть
const getHeaders = () => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

// GET запрос
// endpoint - конечная точка API (например, '/users')
// params - объект с query-параметрами (например, { page: 1, limit: 10 })
export const get = async (endpoint, params = {}) => {
    // Формируем URL с query-параметрами
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    try {
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: getHeaders(),
        });

        const responseData = await response.json();

        // Если статус ответа не в диапазоне 200-299, выбрасываем ошибку
        if (!response.ok) {
            throw new Error(responseData.message || `Помилка: ${response.status}`);
        }

        return responseData;
    } catch (error) {
        console.error('Помилка при виконанні GET-запиту:', error);
        throw error;
    }
};

// POST запрос
// endpoint - конечная точка API
// data - данные для отправки
export const post = async (endpoint, data) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || `Помилка: ${response.status}`);
        }

        return responseData;
    } catch (error) {
        console.error('Помилка при виконанні POST-запиту:', error);
        throw error;
    }
};

// PUT запрос для обновления данных
// endpoint - конечная точка API
// data - данные для обновления
export const put = async (endpoint, data) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || `Помилка: ${response.status}`);
        }

        return responseData;
    } catch (error) {
        console.error('Помилка при виконанні PUT-запиту:', error);
        throw error;
    }
};

// DELETE запрос
// endpoint - конечная точка API
export const remove = async (endpoint) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || `Помилка: ${response.status}`);
        }

        return responseData;
    } catch (error) {
        console.error('Помилка при виконанні DELETE-запиту:', error);
        throw error;
    }
};



/*import { API_BASE_URL } from '../constants';

// * Выполняет GET-запрос к API.
// * @param {string} endpoint - Эндпоинт API.
// * @param {Object} params - Параметры запроса (опционально).
// * @returns {Promise} - Промис с результатом запроса.
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
// Вот этот чуть лучше того что выше:
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

// * Выполняет POST-запрос к API.
// * @param {string} endpoint - Эндпоинт API.
// * @param {Object} data - Данные для отправки.
// * @returns {Promise} - Промис с результатом запроса.
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
// Вот этот чуть лучше того что выше:
export const post = async (endpoint, data) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
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

// * Выполняет PUT-запрос к API.
// * @param {string} endpoint - Эндпоинт API.
// * @param {Object} data - Данные для отправки.
// * @returns {Promise} - Промис с результатом запроса.
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
// Вот этот чуть лучше того что выше:
export const put = async (endpoint, data) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || `Ошибка: ${response.status}`);
        }

        return responseData;
    } catch (error) {
        console.error('шибка при выполнении PUT-запроса:', error);
        throw error;
    }
};

// * Выполняет DELETE-запрос к API.
// * @param {string} endpoint - Эндпоинт API.
// * @returns {Promise} - Промис с результатом запроса.
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
// Вот этот чуть лучше того что выше:
export const remove = async (endpoint) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || `Ошибка: ${response.status}`);
        }

        return responseData;
    } catch (error) {
        console.error('Ошибка при выполнении DELETE-запроса:', error);
        throw error;
    }
};*/
