import axios from 'axios';
import { API_BASE_URL, ENDPOINTS } from '../utils/constants';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Интерцептор для добавления токена
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const recipeService = {
    getFeaturedRecipes: () => api.get(ENDPOINTS.FEATURED_RECIPES),
    getCategories: () => api.get(ENDPOINTS.CATEGORIES),
    getNewRecipes: () => api.get(ENDPOINTS.NEW_RECIPES),
    getPopularRecipes: () => api.get(ENDPOINTS.POPULAR_RECIPES),
    getBestRecipes: () => api.get(ENDPOINTS.BEST_RECIPES),
    getAuthors: () => api.get(ENDPOINTS.AUTHORS),
};