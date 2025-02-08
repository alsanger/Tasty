<?php

namespace App\Http\Controllers\Api\V1\Recipe;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Recipe\NewestRecipesRequest;
use App\Http\Requests\Api\V1\Recipe\RecipeSearchRequest;
use App\Http\Requests\Api\V1\Recipe\TopAuthorsRequest;
use App\Http\Requests\Api\V1\Recipe\TopRecipesRequest;
use App\Http\Resources\Api\V1\Recipe\RecipeCollection;
use App\Http\Resources\Api\V1\User\UserCollection;
use App\Models\Recipe;
use App\Models\User;
use App\Services\RecipeService;

class RecipeSearchController extends Controller
{
    public function search(RecipeSearchRequest $request): RecipeCollection
    {
        $query = Recipe::query()
            ->with([
                'user',
                'category',
                'cookingMethod',
                'country',
                'ingredients',
                'ingredients.unit',
                'recipeSteps',
                'reviews'
            ]);

        // Поиск по названию
        if ($request->filled('name')) {
            $query->whereRaw('LOWER(name) like ?', ['%' . strtolower($request->name) . '%']);
        }

        // Поиск по 'user_id'
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Фильтр по странам
        if ($request->filled('countries')) {
            $query->whereIn('country_id', $request->countries);
        }

        // Фильтр по категориям
        if ($request->filled('categories')) {
            $query->whereIn('category_id', $request->categories);
        }

        // Фильтр по способу приготовления
        if ($request->filled('cooking_methods')) {
            $query->whereIn('cooking_method_id', $request->cooking_methods);
        }

        // Фильтр по калорийности
        if ($request->filled('min_calories')) {
            $query->whereHas('ingredients', function ($q) use ($request) {
                $q->havingRaw('SUM(ingredients.calories * ingredient_recipe.quantity) >= ?', [$request->min_calories]);
            });
        }
        if ($request->filled('max_calories')) {
            $query->whereHas('ingredients', function ($q) use ($request) {
                $q->havingRaw('SUM(ingredients.calories * ingredient_recipe.quantity) <= ?', [$request->max_calories]);
            });
        }

        // Поиск по ингредиентам (включение)
        if ($request->filled('ingredients_include')) {
            $query->whereHas('ingredients', function ($q) use ($request) {
                $q->whereIn('ingredients.id', $request->ingredients_include);
            });
        }

        // Поиск по ингредиентам (исключение)
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

        // Фильтр по максимальному времени приготовления
        if ($request->filled('max_time')) {
            $query->where('time', '<=', $request->max_time);
        }

        // Фильтр по минимальному рейтингу
        if ($request->filled('min_rating')) {
            $query->whereHas('reviews', function ($q) use ($request) {
                $q->havingRaw('AVG(rating) >= ?', [$request->min_rating]);
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
                    $query->orderByRaw('(SELECT SUM(ingredients.calories * ingredient_recipe.quantity) FROM ingredient_recipe JOIN ingredients ON ingredients.id = ingredient_recipe.ingredient_id WHERE ingredient_recipe.recipe_id = recipes.id)' . $direction);
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

        return new RecipeCollection($recipes);
    }

    public function topDay(TopRecipesRequest $request): RecipeCollection
    {
        $query = Recipe::query()
            ->with(['user', 'category', 'cookingMethod', 'country', 'ingredients', 'ingredients.unit', 'recipeSteps', 'reviews'])
            ->whereHas('reviews', function($query) {
                $query->where('created_at', '>=', now()->subDay());
            })
            ->get()
            ->sortByDesc(function($recipe) {
                return RecipeService::calculateRating($recipe);
            })
            ->take(1);

        return new RecipeCollection($query);
    }

    public function topWeek(TopRecipesRequest $request): RecipeCollection
    {
        $query = Recipe::query()
            ->with(['user', 'category', 'cookingMethod', 'country', 'ingredients', 'ingredients.unit', 'recipeSteps', 'reviews'])
            ->whereHas('reviews', function($query) {
                $query->where('created_at', '>=', now()->subWeek());
            })
            ->get()
            ->sortByDesc(function($recipe) {
                return RecipeService::calculateRating($recipe);
            })
            ->take(1);

        return new RecipeCollection($query);
    }

    public function topMonth(TopRecipesRequest $request): RecipeCollection
    {
        $query = Recipe::query()
            ->with(['user', 'category', 'cookingMethod', 'country', 'ingredients', 'ingredients.unit', 'recipeSteps', 'reviews'])
            ->whereHas('reviews', function($query) {
                $query->where('created_at', '>=', now()->subMonth());
            })
            ->get()
            ->sortByDesc(function($recipe) {
                return RecipeService::calculateRating($recipe);
            })
            ->take(1);

        return new RecipeCollection($query);
    }

    public function newest(NewestRecipesRequest $request): RecipeCollection
    {
        $limit = $request->input('limit', 10);

        $recipes = Recipe::query()
            ->with(['user', 'category', 'cookingMethod', 'country', 'ingredients', 'ingredients.unit', 'recipeSteps', 'reviews'])
            ->latest()
            ->limit($limit)
            ->get();

        return new RecipeCollection($recipes);
    }

    public function topRated(TopRecipesRequest $request): RecipeCollection
    {
        $limit = $request->input('limit', 10);

        $recipes = Recipe::query()
            ->with(['user', 'category', 'cookingMethod', 'country', 'ingredients', 'ingredients.unit', 'recipeSteps', 'reviews'])
            ->has('reviews')
            ->get()
            ->sortByDesc(function($recipe) {
                return RecipeService::calculateRating($recipe);
            })
            ->take($limit);

        return new RecipeCollection($recipes);
    }

    public function topAuthors(TopAuthorsRequest $request): UserCollection
    {
        $limit = $request->input('limit', 10);

        $users = User::query()
            ->withCount('followers')
            ->orderBy('followers_count', 'desc')
            ->limit($limit)
            ->get();

        return new UserCollection($users);
    }
}
