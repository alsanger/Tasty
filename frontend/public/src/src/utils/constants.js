// Файл utils/fetchApi/constants.js:
export const BASE_URL = 'http://localhost:8000';
export const API_BASE_URL = `${BASE_URL}/api`;

export const ENDPOINTS = {
    // Аутентификация и пользователи
    LOGIN: '/v1/login',
    REGISTER: '/v1/users',
    USERS: '/v1/users',
    USER_DETAIL: (id) => `/v1/users/${id}`,
    USER_UPDATE: (id) => `/v1/users/${id}`,
    USER_DELETE: (id) => `/v1/users/${id}`,
    USER_ROLES: (id) => `/v1/roles/${id}`,
    USER_FOLLOWERS: (id) => `/v1/users/${id}/followers`,
    USER_FOLLOWING: (id) => `/v1/users/${id}/following`,
    USER_FOLLOW: '/v1/users/follow',
    USER_UNFOLLOW: '/v1/users/unfollow',

    // Рецепты
    TOP_DAY_RECIPE: '/v1/recipes/top-by-period?limit=1&days=1', // Топ рецепт за день
    TOP_WEEK_RECIPE: '/v1/recipes/top-by-period?limit=1&days=7', // Топ рецепт за неделю
    TOP_MONTH_RECIPE: '/v1/recipes/top-by-period?limit=1&days=30', // Топ рецепт за месяц
    TOP_TOP_RECIPE: '/v1/recipes/top-by-period?limit=3&days=365', // Топ рецепт за месяц
    NEW_RECIPES: '/v1/recipes/newest', // Новые рецепты
    BEST_RECIPES: '/v1/recipes/top-rated', // Лучше рецепты
    RECIPES: '/v1/recipes', // Список всех рецептов
    RECIPE_DETAIL: (id) => `/v1/recipes/${id}`, // Рецепт по ID
    SEARCH_RECIPES: '/v1/recipes/search', // Поиск рецептов
    CREATE_RECIPE: '/v1/recipes', // Создание рецепта
    UPDATE_RECIPE: (id) => `/v1/recipes/${id}`, // Обновление рецепта
    DELETE_RECIPE: (id) => `/v1/recipes/${id}`, // Удаление рецепта
    USER_RECIPES: (userId) => `/v1/users/${userId}/recipes`, // Рецепты пользователя

    // Шаги рецептов
    RECIPE_STEPS: (recipeId) => `/v1/recipes/${recipeId}/steps`,
    RECIPE_STEP_DETAIL: (id) => `/v1/recipe-steps/${id}`,
    CREATE_RECIPE_STEP: '/v1/recipe-steps',
    UPDATE_RECIPE_STEP: (id) => `/v1/recipe-steps/${id}`,
    DELETE_RECIPE_STEP: (id) => `/v1/recipe-steps/${id}`,

    // Категории
    CATEGORIES: '/v1/categories', // Категории рецептов
    CATEGORY_DETAIL: (id) => `/v1/categories/${id}`, // Детали категории
    CREATE_CATEGORY: '/v1/categories', // Создание категории
    UPDATE_CATEGORY: (id) => `/v1/categories/${id}`, // Обновление категории
    DELETE_CATEGORY: (id) => `/v1/categories/${id}`, // Удаление категории

    // Методы приготовления еды
    COOKING_METHODS: '/v1/cooking-methods', // Список способов приготовления
    COOKING_METHOD_DETAIL: (id) => `/v1/cooking-methods/${id}`, // Детали способа приготовления
    CREATE_COOKING_METHOD: '/v1/cooking-methods', // Создание способа приготовления
    UPDATE_COOKING_METHOD: (id) => `/v1/cooking-methods/${id}`, // Обновление способа приготовления
    DELETE_COOKING_METHOD: (id) => `/v1/cooking-methods/${id}`, // Удаление способа приготовления

    // Планы приготовления еды
    COOKING_PLANS: '/v1/cooking-plans', // Список планов
    COOKING_PLAN_DETAIL: (id) => `/v1/cooking-plans/${id}`, // Детали плана
    CREATE_COOKING_PLAN: '/v1/cooking-plans', // Создание плана
    UPDATE_COOKING_PLAN: (id) => `/v1/cooking-plans/${id}`, // Обновление плана
    DELETE_COOKING_PLAN: (id) => `/v1/cooking-plans/${id}`, // Удаление плана
    USER_COOKING_PLAN: (userId) => `/v1/cooking-plans-user/${userId}`, // План пользователя

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
    USER_FRIDGE: (userId) => `/v1/fridge-user/${userId}`, // Холодильник пользователя

    // Отзывы
    REVIEWS: '/v1/reviews', // Список отзывов
    REVIEW_DETAIL: (id) => `/v1/reviews/${id}`, // Детали отзыва
    CREATE_REVIEW: '/v1/reviews', // Создание отзыва
    UPDATE_REVIEW: (id) => `/v1/reviews/${id}`, // Обновление отзыва
    DELETE_REVIEW: (id) => `/v1/reviews/${id}`, // Удаление отзыва
    RECIPE_REVIEWS: (recipeId) => `/v1/recipes/${recipeId}/reviews`, // Отзывы на рецепт
    USER_REVIEWS: (userId) => `/v1/users/${userId}/reviews`, // Отзывы пользователя

    // Лайки
    CREATE_LIKE: '/v1/likes', // Создание лайка
    LIKES: '/v1/likes', // Список всех лайков
    LIKES_DETAIL: (id) => `/v1/likes/${id}`, // Детали лайка
    DELETE_LIKE: (id) => `/v1/likes/${id}`, // Удаление лайка
    LIKES_BY_RECIPE: (id) => `/v1/likes-by-recipe/${id}`, // Список всех лайков конкретного рецепта
    LIKES_BY_USER: (id) => `/v1/likes-by-user/${id}`, // Список всех лайков конкретного пользователя

    // Единицы измерения
    UNITS: '/v1/units', // Список единиц измерений
    UNIT_DETAIL: (id) => `/v1/units/${id}`, // Детали единицы измерения
    CREATE_UNIT: '/v1/units', // Создание единицы измерения
    UPDATE_UNIT: (id) => `/v1/units/${id}`, // Обновление единицы измерения
    DELETE_UNIT: (id) => `/v1/units/${id}`, // Удаление единицы измерения

    // Изображения
    IMAGE: {
        UPLOAD_USER_AVATAR: '/v1/upload-user-avatar',
        UPLOAD_CATEGORY_IMAGE: '/v1/upload-category-image',
        UPLOAD_RECIPE_IMAGE: '/v1/upload-recipe-image',
        UPLOAD_RECIPE_STEP_IMAGE: '/v1/upload-recipe-step-image',

        //UPLOAD: '/v1/image-upload',
        DELETE: '/v1/image-delete'
    },

    // Поиск
    SEARCH: '/v1/search', // Общий поиск
};

export const FONT_FAMILIES = {
    PRIMARY: "'NAMU', serif",
    SECONDARY: "'Raleway', sans-serif",
};
export const FONT_LINKS = [
    "https://fonts.googleapis.com/css2?family=Monomakh&family=Raleway:ital,wght@0,100..900;1,100..900&display=swap"
];

export const preferredCountries = ["Україна", "Італія", "Франція", "Мексика", "США", "Німеччина", "Грузія", "Туреччина", "Китай", "Японія", "Азія", "Індія"];