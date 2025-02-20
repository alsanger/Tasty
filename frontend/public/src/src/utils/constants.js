export const API_BASE_URL = 'http://localhost:5173/api';

export const ENDPOINTS = {
    LOGIN: '/v1/login',
    REGISTER: '/v1/users',

    FEATURED_RECIPES: '/v1/featured-recipes', // ПРИМЕР: /api/v1/recipes/featured
    CATEGORIES: '/v1/categories',            // ПРИМЕР: /api/v1/categories
    NEW_RECIPES: '/v1/recipes/newest',          // ПРИМЕР: /api/v1/recipes/new
    POPULAR_RECIPES: '/v1/recipes/top-rated',  // ПРИМЕР: /api/v1/recipes/popular
    BEST_RECIPES: '/v1/recipes/top-rated',        // ПРИМЕР: /api/v1/recipes/best
    AUTHORS: '/v1/authors',                  // ПРИМЕР: /api/v1/authors
};

export const COLORS = {
    primary: '#06A561',
    // другие цвета можем добавить по мере необходимости
};