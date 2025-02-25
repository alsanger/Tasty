export const API_BASE_URL = 'http://localhost:8000/api';
export const ENDPOINTS = {
    // Аутентификация и пользователи
    LOGIN: '/v1/login',
    REGISTER: '/v1/users',
    USERS: '/v1/users',
    USER_DETAIL: (id) => `/v1/users/${id}`,
    USER_ROLES: (id) => `/v1/roles/${id}`,
    USER_FOLLOWERS: (id) => `/v1/users/${id}/followers`,
    USER_FOLLOWING: (id) => `/v1/users/${id}/following`,
    USER_FOLLOW: '/v1/users/follow',
    USER_UNFOLLOW: '/v1/users/unfollow',

    // Рецепты
    FEATURED_RECIPES: '/v1/recipes/top-by-period', // Топ рецепты за период
    NEW_RECIPES: '/v1/recipes/newest', // Новые рецепты
    POPULAR_RECIPES: '/v1/recipes/top-rated', // Популярные рецепты
    BEST_RECIPES: '/v1/recipes/top-rated', // Лучше рецепты (повторяется, может быть удалено)
    RECIPES: '/v1/recipes', // Список всех рецептов
    RECIPE_DETAIL: (id) => `/v1/recipes/${id}`, // Рецепт по ID
    SEARCH_RECIPES: '/v1/recipes/search', // Поиск рецептов
    CREATE_RECIPE: '/v1/recipes', // Создание рецепта
    UPDATE_RECIPE: (id) => `/v1/recipes/${id}`, // Обновление рецепта
    DELETE_RECIPE: (id) => `/v1/recipes/${id}`, // Удаление рецепта
    USER_RECIPES: (userId) => `/v1/users/${userId}/recipes`, // Рецепты пользователя

    // Категории
    CATEGORIES: '/v1/categories', // Категории рецептов
    CATEGORY_DETAIL: (id) => `/v1/categories/${id}`, // Детали категории
    CREATE_CATEGORY: '/v1/categories', // Создание категории
    UPDATE_CATEGORY: (id) => `/v1/categories/${id}`, // Обновление категории
    DELETE_CATEGORY: (id) => `/v1/categories/${id}`, // Удаление категории

    // Авторы
    AUTHORS: '/v1/top-authors', // Топ авторов
    AUTHOR_DETAIL: (id) => `/v1/authors/${id}`, // Детали автора

    // Ингредиенты
    INGREDIENTS: '/v1/ingredients', // Список ингредиентов
    INGREDIENT_DETAIL: (id) => `/v1/ingredients/${id}`, // Детали ингредиента
    CREATE_INGREDIENT: '/v1/ingredients', // Создание ингредиента
    UPDATE_INGREDIENT: (id) => `/v1/ingredients/${id}`, // Обновление ингредиента
    DELETE_INGREDIENT: (id) => `/v1/ingredients/${id}`, // Удаление ингредиента

    // Страны
    COUNTRIES: '/v1/countries', // Список стран
    COUNTRY_DETAIL: (id) => `/v1/countries/${id}`, // Детали страны
    CREATE_COUNTRY: '/v1/countries', // Создание страны
    UPDATE_COUNTRY: (id) => `/v1/countries/${id}`, // Обновление страны
    DELETE_COUNTRY: (id) => `/v1/countries/${id}`, // Удаление страны

    // Холодильники
    FRIDGES: '/v1/fridges', // Список холодильников
    FRIDGE_DETAIL: (id) => `/v1/fridges/${id}`, // Детали холодильника
    CREATE_FRIDGE: '/v1/fridges', // Создание холодильника
    UPDATE_FRIDGE: (id) => `/v1/fridges/${id}`, // Обновление холодильника
    DELETE_FRIDGE: (id) => `/v1/fridges/${id}`, // Удаление холодильника
    USER_FRIDGES: (userId) => `/v1/users/${userId}/fridges`, // Холодильники пользователя

    // Отзывы
    REVIEWS: '/v1/reviews', // Список отзывов
    REVIEW_DETAIL: (id) => `/v1/reviews/${id}`, // Детали отзыва
    CREATE_REVIEW: '/v1/reviews', // Создание отзыва
    UPDATE_REVIEW: (id) => `/v1/reviews/${id}`, // Обновление отзыва
    DELETE_REVIEW: (id) => `/v1/reviews/${id}`, // Удаление отзыва
    RECIPE_REVIEWS: (recipeId) => `/v1/recipes/${recipeId}/reviews`, // Отзывы на рецепт
    USER_REVIEWS: (userId) => `/v1/users/${userId}/reviews`, // Отзывы пользователя

    // Единицы измерения
    UNITS: '/v1/units', // Список единиц измерений
    UNIT_DETAIL: (id) => `/v1/units/${id}`, // Детали единицы измерения
    CREATE_UNIT: '/v1/units', // Создание единицы измерения
    UPDATE_UNIT: (id) => `/v1/units/${id}`, // Обновление единицы измерения
    DELETE_UNIT: (id) => `/v1/units/${id}`, // Удаление единицы измерения

    // Изображения
    IMAGE: {
        GET: '/v1/image',
        UPLOAD: '/v1/image-upload',
        DELETE: '/v1/image-delete'
    },

    // Поиск
    SEARCH: '/v1/search', // Общий поиск
};