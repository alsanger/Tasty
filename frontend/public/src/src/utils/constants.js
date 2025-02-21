export const API_BASE_URL = 'http://localhost:5173/api';

export const ENDPOINTS = {
    LOGIN: '/v1/login',
    REGISTER: '/v1/users',

    FEATURED_RECIPES: '/v1/recipes/top-by-period', // Топ рецепты за период
    CATEGORIES: '/v1/categories',  // Категории рецептов
    NEW_RECIPES: '/v1/recipes/newest',  // Новые рецепты
    POPULAR_RECIPES: '/v1/recipes/top-rated', // Популярные рецепты
    BEST_RECIPES: '/v1/recipes/top-rated',  // Лучше рецепты (повторяется, может быть удалено)
    AUTHORS: '/v1/top-authors',  // Топ авторов

    INGREDIENTS: '/v1/ingredients',  // Список ингредиентов
    INGREDIENT_DETAIL: (id) => `/v1/ingredients/${id}`,  // Детали ингредиента

    COUNTRIES: '/v1/countries',  // Список стран
    COUNTRY_DETAIL: (id) => `/v1/countries/${id}`,  // Детали страны

    RECIPE_DETAIL: (id) => `/v1/recipes/${id}`,  // Рецепт по ID
    SEARCH_RECIPES: '/v1/recipes/search',  // Поиск рецептов

    FRIDGES: '/v1/fridges',  // Список холодильников
    FRIDGE_DETAIL: (id) => `/v1/fridges/${id}`,  // Детали холодильника

    REVIEWS: '/v1/reviews',  // Список отзывов
    REVIEW_DETAIL: (id) => `/v1/reviews/${id}`,  // Детали отзыва

    UNITS: '/v1/units',  // Список единиц измерений
    UNIT_DETAIL: (id) => `/v1/units/${id}`,  // Детали единицы измерения
};
