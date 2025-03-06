<?php

use App\Http\Controllers\Api\V1\Category\CategoryController;
use App\Http\Controllers\Api\V1\CookingMethod\CookingMethodController;
use App\Http\Controllers\Api\V1\CookingPlan\CookingPlanController;
use App\Http\Controllers\Api\V1\Country\CountryController;
use App\Http\Controllers\Api\V1\Fridge\FridgeController;
use App\Http\Controllers\Api\V1\Image\ImageUploadController;
use App\Http\Controllers\Api\V1\Ingredient\IngredientController;
use App\Http\Controllers\Api\V1\Recipe\RecipeController;
use App\Http\Controllers\Api\V1\Recipe\RecipeSearchController;
use App\Http\Controllers\Api\V1\RecipeStep\RecipeStepController;
use App\Http\Controllers\Api\V1\Review\ReviewController;
use App\Http\Controllers\Api\V1\Unit\UnitController;
use App\Http\Controllers\Api\V1\User\AuthController;
use App\Http\Controllers\Api\V1\User\EmailVerificationController;
use App\Http\Controllers\Api\V1\User\FollowController;
use App\Http\Controllers\Api\V1\User\UserController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'v1'], function () {
    // ГРУППА ДЛЯ НЕАУТЕНТИФИЦИРОВАННЫХ ПОЛЬЗОВАТЕЛЕЙ (ГОСТЕЙ):
    Route::post('/users', [UserController::class, 'store']);  // Регистрация пользователя
    Route::post('/login', [AuthController::class, 'login'])  // Аутентификация пользователя
        ->name('login');
    //Route::get('/image', [ImageUploadController::class, 'getImage']); // Получение изображений

    // Маршруты для полученния данных для отображения на главной странице
    Route::get('/recipes/top-by-period', [RecipeSearchController::class, 'topByPeriod']); // Получение списка топовых рецептов за определенный период
    Route::get('/recipes/newest', [RecipeSearchController::class, 'newest']); // Получение списка самых новых рецептов
    Route::get('/recipes/top-rated', [RecipeSearchController::class, 'topRated']); // Получение списка самых рейтинговых рецептов
    Route::get('/top-authors', [RecipeSearchController::class, 'topAuthors']); // Получение списка пользователей с наибольшим количеством подписок

    // Маршруты для работы с категориями рецептов:
    Route::get('/categories', [CategoryController::class, 'index']);  // Получение списка категорий
    Route::get('/categories/{category}', [CategoryController::class, 'show']); // Получение одной категории
    // Маршруты для работы с способами приготовления рецептов:
    Route::get('/cooking-methods', [CookingMethodController::class, 'index']);  // Получение списка способов приготовления
    Route::get('/cooking-methods/{cookingMethod}', [CookingMethodController::class, 'show']); // Получение одного способа приготовления
    // Маршруты для работы со странами рецептов:
    Route::get('/countries', [CountryController::class, 'index']);  // Получение списка стран
    Route::get('/countries/{country}', [CountryController::class, 'show']); // Получение одной страны
    // Маршруты для работы с ингредиентами:
    Route::get('/ingredients', [IngredientController::class, 'index']);  // Получение списка ингредиентов
    Route::get('/ingredients/{ingredient}', [IngredientController::class, 'show']); // Получение одного ингредиента
    // Маршруты для работы с рецептами:
    Route::get('/recipes', [RecipeController::class, 'index']); // Получение списка рецептов
    Route::get('/recipes/{recipe}', [RecipeController::class, 'show']); // Получение одного рецепта
    Route::post('/recipes/search', [RecipeSearchController::class, 'search']); // Поиск рецептов
    // Маршруты для работы с шагами рецептов:
    Route::get('/recipes/{recipe}/steps', [RecipeStepController::class, 'index']); // Получение списка шагов рецепта
    Route::get('/recipe-steps/{recipeStep}', [RecipeStepController::class, 'show']); // Получение одного шага рецепта
    // Маршруты для работы с отзывами:
    Route::get('/reviews', [ReviewController::class, 'index']);  // Получение списка отзывов
    Route::get('/reviews/{review}', [ReviewController::class, 'show']);  // Получение одного отзыва
    // Маршруты для работы с единицами измерения ингредиентов:
    Route::get('/units', [UnitController::class, 'index']);  // Получение списка units
    Route::get('/units/{unit}', [UnitController::class, 'show']); // Получение одного unit

    //ГРУППА ДЛЯ АУТЕНТИФИЦИРОВАННЫХ ПОЛЬЗОВАТЕЛЕЙ С НЕВЕРИФИЦИРОВАННЫМ EMAIL:
    Route::group(['middleware' => 'auth:sanctum'], function () {
        Route::post('/logout', [AuthController::class, 'logout'])  // Выход из системы
            ->name('logout');
    });

    //ГРУППА ДЛЯ АУТЕНТИФИЦИРОВАННЫХ ПОЛЬЗОВАТЕЛЕЙ С ВЕРИФИЦИРОВАННЫМ EMAIL:
    Route::group(['middleware' => ['auth:sanctum', 'verified']], function () {
        // Маршруты для работы с категориями рецептов:
        Route::post('/categories', [CategoryController::class, 'store']);  // Создание категории
        Route::put('/categories/{category}', [CategoryController::class, 'update']);  // Обновление категории
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);  // Удаление категории
        // Маршруты для работы с способами приготовления рецептов:
        Route::post('/cooking-methods', [CookingMethodController::class, 'store']);  // Создание способа приготовления
        Route::put('/cooking-methods/{cookingMethod}', [CookingMethodController::class, 'update']);  // Обновление способа приготовления
        Route::delete('/cooking-methods/{cookingMethod}', [CookingMethodController::class, 'destroy']);  // Удаление способа приготовления
        // Маршруты для работы с планами приготовлени еды:
        Route::get('/cooking-plans', [CookingPlanController::class, 'index']);  // Получение списка планов приготовления еды
        Route::get('/cooking-plans/{cookingPlan}', [CookingPlanController::class, 'show']); // Получение одного плана приготовления еды
        Route::post('/cooking-plans', [CookingPlanController::class, 'store']);  // Создание плана приготовления еды
        Route::put('/cooking-plans/{cookingPlan}', [CookingPlanController::class, 'update']);  // Обновление плана приготовления еды
        Route::delete('/cooking-plans/{cookingPlan}', [CookingPlanController::class, 'destroy']);  // Удаление плана приготовления еды
        // Маршруты для работы со странами рецептов:
        Route::post('/countries', [CountryController::class, 'store']);  // Добавление страны
        Route::put('/countries/{country}', [CountryController::class, 'update']);  // Обновление страны
        Route::delete('/countries/{country}', [CountryController::class, 'destroy']);  // Удаление страны
        // Маршруты для работы с "холодильником":
        Route::get('/fridges', [FridgeController::class, 'index']);  // Получение списка "холодильников"
        Route::get('/fridges/{fridge}', [FridgeController::class, 'show']);  // Получение одного "холодильника"
        Route::post('/fridges', [FridgeController::class, 'store']);  // Создание "холодильника"
        Route::put('/fridges/{fridge}', [FridgeController::class, 'update']);  // Обновление "холодильника"
        Route::delete('/fridges/{fridge}', [FridgeController::class, 'destroy']);  // Удаление "холодильника"
        // Маршруты для работы с ингредиентами:
        Route::post('/ingredients', [IngredientController::class, 'store']);  // Создание ингредиента
        Route::put('/ingredients/{ingredient}', [IngredientController::class, 'update']);  // Обновление ингредиента
        Route::delete('/ingredients/{ingredient}', [IngredientController::class, 'destroy']);  // Удаление ингредиента
        // Маршруты для работы с рецептами:
        Route::post('/recipes', [RecipeController::class, 'store']);  // Создание рецепта
        Route::put('/recipes/{recipe}', [RecipeController::class, 'update']);  // Обновление рецепта
        Route::delete('/recipes/{recipe}', [RecipeController::class, 'destroy']);  // Удаление рецепта
        // Маршруты для работы с шагами рецептов:
        Route::post('/recipe-steps', [RecipeStepController::class, 'store']);  // Создание шага рецепта
        Route::put('/recipe-steps/{recipeStep}', [RecipeStepController::class, 'update']);  // Обновление шага рецепта
        Route::delete('/recipe-steps/{recipeStep}', [RecipeStepController::class, 'destroy']);  // Удаление шага рецепта
        // Маршруты для работы с отзывами:
        Route::post('/reviews', [ReviewController::class, 'store']);  // Создание отзыва
        Route::put('/reviews/{review}', [ReviewController::class, 'update']);  // Обновление отзыва
        Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);  // Удаление отзыва
        // Маршруты для работы с единицами измерения ингредиентов:
        Route::post('/units', [UnitController::class, 'store']);  // Создание unit
        Route::put('/units/{unit}', [UnitController::class, 'update']);  // Обновление unit
        Route::delete('/units/{unit}', [UnitController::class, 'destroy']);  // Удаление unit
        // Маршруты для работы с пользователями:
        Route::get('/users', [UserController::class, 'index']);  // Получение списка пользователей
        Route::get('users/{user}', [UserController::class, 'show']);  // Получение одного пользователя
        Route::put('/users/{user}', [UserController::class, 'update']);  // Обновление пользователя
        Route::delete('/users/{user}', [UserController::class, 'destroy']);  // Удаление пользователя
        Route::get('/roles/{user}', [UserController::class, 'roles']);  // Получение ролей пользователя
        // Подписка на пользователя и отписка
        Route::get('/users/{user}/followers', [FollowController::class, 'followers']);
        Route::get('/users/{user}/following', [FollowController::class, 'following']);
        Route::post('/users/follow', [FollowController::class, 'follow']);
        Route::post('/users/unfollow', [FollowController::class, 'unfollow']);
        // Маршруты для работы с изображениями:
        Route::post('/upload-user-avatar', [ImageUploadController::class, 'uploadUserAvatar']); // Загрузка аватара пользователя
        Route::post('/upload-category-image', [ImageUploadController::class, 'uploadCategoryImage']); // Загрузка изображения категории
        Route::post('/upload-recipe-image', [ImageUploadController::class, 'uploadRecipeImage']); // Загрузка изображения рецепта
        Route::post('/upload-recipe-step-image', [ImageUploadController::class, 'uploadRecipeStepImage']); // Загрузка изображения шага рецепта
        Route::delete('/image-delete', [ImageUploadController::class, 'delete']); // Удаление изображения
    });

    // Маршруты для верификации email:
    Route::get('/email/verify', [EmailVerificationController::class, 'notice']) // Проверка статуса верификации
        ->name('verification.notice');
    Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify']) // Верификация email
        ->middleware('signed')
        ->name('verification.verify');
    Route::post('/email/verification-notification', [EmailVerificationController::class, 'sendVerificationEmail']) // Отправка ссылки для верификации email
        ->middleware('throttle:3,1')
        ->name('verification.send');
    // ГРУППА ГОСТЕВЫХ ПАРОЛЕЙ ДЛЯ СБРОСА ПАРОЛЯ:
    Route::group(['middleware' => 'guest'], function () {
        Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])
            ->name('password.email');
        Route::get('/reset-password/{token}', [AuthController::class, 'resetPassword'])
            ->name('password.reset');
        Route::post('/reset-password', [AuthController::class, 'updatePassword'])
            ->name('password.update');
    });



})->middleware('throttle:api');
