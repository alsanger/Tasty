<?php

namespace App\Http\Controllers\Api\V1\Recipe;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Recipe\NewestRecipesRequest;
use App\Http\Requests\Api\V1\Recipe\RecipeSearchRequest;
use App\Http\Requests\Api\V1\Recipe\TopAuthorsRequest;
use App\Http\Requests\Api\V1\Recipe\TopRecipesRequest;
use App\Http\Resources\Api\V1\Recipe\RecipeCollection;
use App\Http\Resources\Api\V1\User\UserCollection;
use App\Models\Fridge;
use App\Models\Recipe;
use App\Models\User;
use App\Services\RecipeService;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class RecipeSearchController extends Controller
{
    public function search(RecipeSearchRequest $request): RecipeCollection
    {
        Log::info(request());
        $query = Recipe::query()
            ->with([
                'user',
                'category',
                'cookingMethod',
                'country',
                'ingredients',
                'ingredients.unit',
                'recipeSteps',
                'reviews',
                'likes'
            ]);

        // Поиск рецептов по ингредиентам из холодильника
        if ($request->filled('fridge') && $request->fridge === true) {
            if ($request->filled('user_id')) {
                // Получаем холодильник пользователя
                $fridge = Fridge::query()
                    ->where('user_id', $request->user_id)
                    ->first();

                if ($fridge) {
                    // Получаем ID ингредиентов, которые есть в холодильнике (количество > 0)
                    $fridgeIngredients = $fridge->ingredients()
                        ->wherePivot('quantity', '>', 0)
                        ->pluck('ingredients.id')
                        ->toArray();

                    if (count($fridgeIngredients) > 0) {
                        // Находим рецепты, которые содержат ТОЛЬКО ингредиенты из холодильника
                        $query->whereDoesntHave('ingredients', function ($q) use ($fridgeIngredients) {
                            $q->whereNotIn('ingredients.id', $fridgeIngredients);
                        });
                    } else {
                        // Если в холодильнике нет ингредиентов, возвращаем пустой результат
                        $query->whereRaw('1 = 0');
                    }
                } else {
                    // Если холодильник не найден, возвращаем пустой результат
                    $query->whereRaw('1 = 0');
                }
            } else {
                // Если user_id не указан, но fridge=true, возвращаем пустой результат
                $query->whereRaw('1 = 0');
            }
        }

        // Поиск по названию
        if ($request->filled('name')) {
            $query->whereRaw('LOWER(name) like ?', ['%' . strtolower($request->name) . '%']);
        }

        // Поиск по 'user_id'
        if ($request->filled('user_id')) {
            // Если user_id — это массив
            if (is_array($request->user_id)) {
                $query->whereIn('user_id', $request->user_id);
            }
            // Если user_id — это одно значение
            else {
                $query->where('user_id', $request->user_id);
            }
        }

        // Фильтр по странам
        if ($request->filled('countries')) {
            // Если countries — это массив
            if (is_array($request->countries)) {
                $query->whereIn('country_id', $request->countries);
            }
            // Если countries — это одно значение
            else {
                $query->where('country_id', $request->countries);
            }
        }

        // Фильтр по категориям
        if ($request->filled('categories')) {
            // Если categories — это массив
            if (is_array($request->categories)) {
                $query->whereIn('category_id', $request->categories);
            }
            // Если categories — это одно значение
            else {
                $query->where('category_id', $request->categories);
            }
        }

        // Фильтр по способу приготовления
        if ($request->filled('cooking_methods')) {
            // Если cooking_methods — это массив
            if (is_array($request->cooking_methods)) {
                $query->whereIn('cooking_method_id', $request->cooking_methods);
            }
            // Если cooking_methods — это одно значение
            else {
                $query->where('cooking_method_id', $request->cooking_methods);
            }
        }

        // Фильтр по калорийности
        if ($request->filled('min_calories')) {
            $query->whereHas('ingredients', function ($q) use ($request) {
                $q->select('recipe_id')
                    ->groupBy('recipe_id')
                    ->havingRaw('SUM(ingredients.calories * ingredient_recipe.quantity) >= ?', [$request->min_calories]);
            });
        }

        /*// Логирование для проверки калорийности
        $recipesForLog = Recipe::with(['ingredients' => function ($query) {
            $query->withPivot('quantity'); // Загружаем количество ингредиентов
        }])->get();

        foreach ($recipesForLog as $recipe) {
            $ingredientsLog = [];
            $totalCalories = 0;

            foreach ($recipe->ingredients as $ingredient) {
                $calories = $ingredient->calories;
                $quantity = $ingredient->pivot->quantity;
                $totalCalories += $calories * $quantity;

                $ingredientsLog[] = "{$ingredient->name} (ID: {$ingredient->id}): {$calories} калорий * {$quantity} = " . ($calories * $quantity);
            }

            Log::info("Рецепт: {$recipe->name} (ID: {$recipe->id})");
            Log::info("Ингредиенты и расчет калорий:");
            Log::info(implode("\n", $ingredientsLog));
            Log::info("Общая калорийность: {$totalCalories}");
            Log::info("--------------------");
        }*/

        if ($request->filled('max_calories')) {
            $query->whereHas('ingredients', function ($q) use ($request) {
                $q->select('recipe_id')
                    ->groupBy('recipe_id')
                    ->havingRaw('SUM(ingredients.calories * ingredient_recipe.quantity) <= ?', [$request->max_calories]);
            });
        }

        // Поиск по ингредиентам (все ингредиенты из массива должны быть в рецепте)
        if ($request->filled('ingredients_include')) {
            $ingredientIds = $request->ingredients_include;

            foreach ($ingredientIds as $ingredientId) {
                $query->whereHas('ingredients', function ($q) use ($ingredientId) {
                    $q->where('ingredients.id', $ingredientId);
                });
            }
        }

        // Поиск по ингредиентам (любой из ингредиентов из массива не должен быть в рецепте)
        if ($request->filled('ingredients_exclude')) {
            $query->whereDoesntHave('ingredients', function ($q) use ($request) {
                $q->whereIn('ingredients.id', $request->ingredients_exclude);
            });
        }

        // Поиск рецептов только с указанными ингредиентами
        if ($request->filled('ingredients_only')) {
            $query->whereHas('ingredients', function ($q) use ($request) {
                $q->whereIn('ingredients.id', $request->ingredients_only);
            })->whereDoesntHave('ingredients', function ($q) use ($request) {
                $q->whereNotIn('ingredients.id', $request->ingredients_only);
            });
        }

        // Поиск рецептов из ингредиентов холодильника
        if ($request->filled('fridge_ingredients')) {
            $query->whereHas('ingredients', function ($q) use ($request) {
                $q->whereIn('ingredients.id', $request->fridge_ingredients);
            });
        }

        // Фильтр по минимальному времени приготовления
        if ($request->filled('min_time')) {
            $query->where('time', '>=', $request->min_time);
        }

        // Фильтр по максимальному времени приготовления
        if ($request->filled('max_time')) {
            $query->where('time', '<=', $request->max_time);
        }

        // Фильтр по минимальному рейтингу
        if ($request->filled('min_rating')) {
            $query->whereHas('reviews', function ($q) use ($request) {
                $q->select('recipe_id')
                    ->groupBy('recipe_id')
                    ->havingRaw('AVG(rating) >= ?', [$request->min_rating]);
            });
        }

        // Фильтр по сложности приготовления
        if ($request->filled('difficulty_min')) {
            $query->where('difficulty', '>=', $request->difficulty_min);
        }
        if ($request->filled('difficulty_max')) {
            $query->where('difficulty', '<=', $request->difficulty_max);
        }

        // Сортировка
        if ($request->filled('order_by')) {
            $direction = $request->order_direction ?? 'asc';

            switch ($request->order_by) {
                case 'name':
                    $query->orderBy('name', $direction);
                    break;
                case 'rating':
                    $query->withAvg('reviews', 'rating')
                        ->orderBy('reviews_avg_rating', $direction);
                    break;
                case 'calories':
                    $query->orderByRaw('(SELECT SUM(ingredients.calories * ingredient_recipe.quantity) FROM ingredient_recipe JOIN ingredients ON ingredients.id = ingredient_recipe.ingredient_id WHERE ingredient_recipe.recipe_id = recipes.id GROUP BY ingredient_recipe.recipe_id)' . $direction);
                    break;
                case 'time':
                    $query->orderBy('time', $direction);
                    break;
                case 'difficulty':
                    $query->orderBy('difficulty', $direction);
                    break;
            }
        } else {
            // По умолчанию сортировка по дате создания
            $query->latest();
        }

        // Пагинация
        $perPage = $request->per_page ?? 30;
        $recipes = $query->paginate($perPage);


        Log::info("--------------------");
        // Логирование наименований рецептов через запятую
        $recipeNames = $recipes->getCollection()->pluck('name')->implode(', ');
        Log::info("Найденные рецепты: " . $recipeNames);

        Log::info("--------------------");
        return new RecipeCollection($recipes);
    }

    //ИЗНАЧАЛЬНЫЙ
    public function topByPeriod(TopRecipesRequest $request): RecipeCollection
    {
        $limit = $request->input('limit', 1);
        $requestedDays = $request->input('days');

        $recipes = collect();
        $days = $requestedDays;

        // Будем расширять период поиска, пока не найдем хотя бы один рецепт
        while ($recipes->isEmpty() && $days <= 365) {
            $recipes = Recipe::query()
                ->with(['user', 'category', 'cookingMethod', 'country', 'ingredients', 'ingredients.unit', 'recipeSteps', 'reviews', 'likes'])
                ->whereHas('reviews', function($query) use ($days) {
                    $query->where('created_at', '>=', now()->subDays($days));
                })
                ->get()
                ->sortByDesc(function($recipe) {
                    return RecipeService::calculateRating($recipe);
                })
                ->take($limit)
                ->values();

            // Если ничего не нашли, удваиваем период
            if ($recipes->isEmpty()) {
                $days *= 2;
            }
        }

        // Если всё ещё пусто после всех попыток, берем лучшие рецепты за всё время
        if ($recipes->isEmpty()) {
            $recipes = Recipe::query()
                ->with(['user', 'category', 'cookingMethod', 'country', 'ingredients', 'ingredients.unit', 'recipeSteps', 'reviews', 'likes'])
                ->whereHas('reviews')
                ->get()
                ->sortByDesc(function($recipe) {
                    return RecipeService::calculateRating($recipe);
                })
                ->take($limit)
                ->values();
        }

        // Если и это не помогло (вообще нет рецептов с отзывами), берем просто последние рецепты
        if ($recipes->isEmpty()) {
            $recipes = Recipe::query()
                ->with(['user', 'category', 'cookingMethod', 'country', 'ingredients', 'ingredients.unit', 'recipeSteps', 'reviews', 'likes'])
                ->latest()
                ->take($limit)
                ->get()
                ->values();
        }

        $paginator = new LengthAwarePaginator(
            $recipes,
            $recipes->count(),
            $limit,
            1
        );

        return new RecipeCollection($paginator);
    }
    /*public function topByPeriod(TopRecipesRequest $request): RecipeCollection
    {
        Log::info("Попали в метод topByPeriod");

        $limit = (int) $request->input('limit', 10);
        $requestedDays = (int) $request->input('days', 7);

        $recipes = collect();
        $days = $requestedDays;

        // Будем экспоненциально расширять период поиска, пока не найдем достаточно рецептов
        while ($recipes->count() < $limit && $days <= 365) {
            $query = Recipe::query()
                ->with([
                    'user', 'category', 'cookingMethod', 'country',
                    'ingredients', 'ingredients.unit', 'recipeSteps', 'reviews'
                ])
                ->whereHas('reviews', function($query) use ($days) {
                    $query->where('created_at', '>=', now()->subDays($days));
                });

            // Используем прямую SQL-сортировку, если есть поле rating
            if (Schema::hasColumn('recipes', 'rating')) {
                $query->orderByDesc('rating');
            } else {
                // Иначе используем withAvg для вычисления среднего рейтинга
                $query->withAvg('reviews', 'rating')
                    ->orderByDesc('reviews_avg_rating');
            }

            $recipes = $query->limit($limit)->get();

            // Если ничего не нашли, увеличиваем период экспоненциально
            if ($recipes->isEmpty()) {
                $days *= 2;
            } else if ($recipes->count() < $limit) {
                // Если нашли, но недостаточно, увеличиваем период линейно
                $days += $requestedDays;
            }
        }

        // Если всё ещё недостаточно после всех попыток с ограничением периода,
        // берем лучшие рецепты за всё время
        if ($recipes->count() < $limit) {
            $query = Recipe::query()
                ->with([
                    'user', 'category', 'cookingMethod', 'country',
                    'ingredients', 'ingredients.unit', 'recipeSteps', 'reviews'
                ])
                ->whereHas('reviews');

            if (Schema::hasColumn('recipes', 'rating')) {
                $query->orderByDesc('rating');
            } else {
                $query->withAvg('reviews', 'rating')
                    ->orderByDesc('reviews_avg_rating');
            }

            $recipes = $query->limit($limit)->get();
        }

        // Если и это не помогло (вообще нет рецептов с отзывами),
        // берем просто последние рецепты
        if ($recipes->isEmpty()) {
            $recipes = Recipe::query()
                ->with([
                    'user', 'category', 'cookingMethod', 'country',
                    'ingredients', 'ingredients.unit', 'recipeSteps', 'reviews'
                ])
                ->latest()
                ->limit($limit)
                ->get();
        }

        $paginator = new LengthAwarePaginator(
            $recipes,
            $recipes->count(),
            $limit,
            1
        );

        return new RecipeCollection($paginator);
    }*/
    /*public function topByPeriod(TopRecipesRequest $request): RecipeCollection
    {
        $limit = (int) $request->input('limit', 10);
        $requestedDays = (int) $request->input('days', 7);

        Log::info("=== НАЧАЛО ОТЛАДКИ TOP BY PERIOD ===");
        Log::info("Запрошенные параметры: limit={$limit}, days={$requestedDays}");
        Log::info("Текущее время: " . now());
        Log::info("Начальная дата отсечения: " . now()->subDays($requestedDays)->toDateString()); // Логируем только дату

        $days = $requestedDays;

        // Отладка временных зон
        try {
            $appTime = now();
            $dbTime = DB::select('SELECT NOW() as time')[0]->time;
            Log::info("Время приложения: {$appTime}, Время БД: {$dbTime}");
        } catch (\Exception $e) {
            Log::error("Ошибка при проверке времени БД: " . $e->getMessage());
        }

        // Будем экспоненциально расширять период поиска, пока не найдем достаточно рецептов
        $iteration = 1;
        $uniqueRecipeIds = [];
        $finalRecipes = collect();

        while (count($uniqueRecipeIds) < $limit && $days <= 365) {
            $cutoffDate = now()->subDays($days)->toDateString(); // Используем только дату
            Log::info("Итерация {$iteration}: Поиск с периодом days={$days}, дата отсечения={$cutoffDate}");

            // Сначала получаем только ID рецептов (без загрузки самих рецептов)
            $recipeIds = DB::table('reviews')
                ->select('recipe_id')
                ->whereDate('created_at', '>=', $cutoffDate) // Используем whereDate
                ->distinct()
                ->pluck('recipe_id')
                ->toArray();

            $uniqueRecipeIds = $recipeIds;

            Log::info("Найдено " . count($uniqueRecipeIds) . " уникальных рецептов для периода {$days} дней");

            // Если ничего не нашли, увеличиваем период экспоненциально
            if (empty($uniqueRecipeIds)) {
                $prevDays = $days;
                $days *= 2;
                Log::info("Увеличиваем период поиска экспоненциально с {$prevDays} до {$days} дней");
            } else if (count($uniqueRecipeIds) < $limit) {
                // Если нашли, но недостаточно, увеличиваем период линейно
                $prevDays = $days;
                $days += $requestedDays;
                Log::info("Найдено недостаточно рецептов, увеличиваем период линейно с {$prevDays} до {$days} дней");
            } else {
                // Нашли достаточно рецептов, выходим из цикла
                Log::info("Найдено достаточно рецептов (" . count($uniqueRecipeIds) . "), прекращаем поиск");
                break;
            }

            $iteration++;
        }

        // Теперь загружаем найденные рецепты и сортируем их по рейтингу
        if (!empty($uniqueRecipeIds)) {
            Log::info("Загружаем " . count($uniqueRecipeIds) . " рецептов");

            $query = Recipe::query()
                ->with([
                    'user', 'category', 'cookingMethod', 'country',
                    'ingredients', 'ingredients.unit', 'recipeSteps', 'reviews'
                ])
                ->whereIn('id', $uniqueRecipeIds);

            // Используем сортировку по рейтингу, если есть
            if (Schema::hasColumn('recipes', 'rating')) {
                $query->orderByDesc('rating');
                Log::info("Сортировка по колонке rating");
            } else {
                // Иначе используем withAvg для вычисления среднего рейтинга
                $query->withAvg('reviews', 'rating')
                    ->orderByDesc('reviews_avg_rating');
                Log::info("Сортировка по среднему рейтингу отзывов (reviews_avg_rating)");
            }

            $finalRecipes = $query->limit($limit)->get();

            Log::info("Загружено {$finalRecipes->count()} рецептов после сортировки");
        }

        // Если не нашли рецептов с отзывами, берем просто последние рецепты
        if ($finalRecipes->isEmpty()) {
            Log::info("Не найдено рецептов с отзывами, возвращаем последние добавленные рецепты");

            $finalRecipes = Recipe::query()
                ->with([
                    'user', 'category', 'cookingMethod', 'country',
                    'ingredients', 'ingredients.unit', 'recipeSteps', 'reviews'
                ])
                ->latest()
                ->limit($limit)
                ->get();

            Log::info("Загружено {$finalRecipes->count()} последних рецептов");
        }

        $paginator = new LengthAwarePaginator(
            $finalRecipes,
            $finalRecipes->count(),
            $limit,
            1
        );

        Log::info("=== КОНЕЦ ОТЛАДКИ TOP BY PERIOD ===");

        return new RecipeCollection($paginator);
    }*/

    public function newest(NewestRecipesRequest $request): RecipeCollection
    {
        $limit = $request->input('limit', 10);

        $recipes = Recipe::query()
            ->with(['user', 'category', 'cookingMethod', 'country', 'ingredients', 'ingredients.unit', 'recipeSteps', 'reviews', 'likes'])
            ->latest()
            ->limit($limit)
            ->get()
            ->values();

        $paginator = new LengthAwarePaginator(
            $recipes,
            $recipes->count(),
            $limit,
            1
        );

        return new RecipeCollection($paginator);
    }

    public function topRated(TopRecipesRequest $request): RecipeCollection
    {
        $limit = $request->input('limit', 10);

        $recipes = Recipe::query()
            ->with(['user', 'category', 'cookingMethod', 'country', 'ingredients', 'ingredients.unit', 'recipeSteps', 'reviews', 'likes'])
            /*->has('reviews')*/
            ->get()
            ->sortByDesc(function($recipe) {
                return RecipeService::calculateRating($recipe);
            })
            ->take($limit)
            ->values();

        $paginator = new LengthAwarePaginator(
            $recipes,
            $recipes->count(),
            $limit,
            1
        );

        return new RecipeCollection($paginator);
    }

    public function topAuthors(TopAuthorsRequest $request): UserCollection
    {
        $limit = $request->input('limit', 10);

        $users = User::query()
            ->withCount('followers')
            ->orderBy('followers_count', 'desc')
            ->limit($limit)
            ->get()
            ->values();

        $paginator = new LengthAwarePaginator(
            $users,
            $users->count(),
            $limit,
            1
        );

        return new UserCollection($paginator);
    }
}
