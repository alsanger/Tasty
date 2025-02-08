<?php

namespace app\Http\Controllers\Api\V1\Recipe;

use app\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Recipe\StoreRecipeRequest;
use App\Http\Requests\Api\V1\Recipe\UpdateRecipeRequest;
use App\Http\Resources\Api\V1\Recipe\RecipeCollection;
use App\Http\Resources\Api\V1\Recipe\RecipeResource;
use App\Models\Recipe;
use Illuminate\Http\JsonResponse;

class RecipeController extends Controller
{
    public function index(): RecipeCollection
    {
        $recipes = Recipe::query()
            ->with([                     // Загрузка связанных данных
                'user',
                'category',
                'cookingMethod',
                'country',
                'ingredients',
                'ingredients.unit',
                'recipeSteps',
                'reviews.user'])
            ->paginate(30);
        return new RecipeCollection($recipes);
    }

    public function store(StoreRecipeRequest $request): RecipeResource
    {
        // Создаем новый рецепт с валидированными данными
        $recipe = Recipe::create($request->validated());

        // Привязываем ингредиенты, если они передаются
        if ($request->has('ingredients')) {
            foreach ($request->ingredients as $ingredientData) {
                $recipe->ingredients()->attach(
                    $ingredientData['ingredient_id'],
                    ['quantity' => $ingredientData['quantity']]
                );
            }
        }

        // Пересчитываем сложность рецепта
        $recipe->update(['difficulty' => Recipe::calculateDifficulty($recipe)]);

        // Загружаем связанные данные и возвращаем ресурс
        return new RecipeResource($recipe->load([
            'user',
            'category',
            'cookingMethod',
            'country',
            'ingredients',
            'ingredients.unit',
            'recipeSteps',
            'reviews.user']));
    }

    public function show(Recipe $recipe): RecipeResource
    {
        // Загружаем связанные данные для указанного рецепта
        return new RecipeResource($recipe->load([
            'user',
            'category',
            'cookingMethod',
            'country',
            'ingredients',
            'ingredients.unit',
            'recipeSteps',
            'reviews.user']));
    }

    public function update(UpdateRecipeRequest $request, Recipe $recipe): RecipeResource
    {
        // Авторизация
        $this->authorize('update', $recipe);

        // Обновляем рецепт с новыми данными
        $recipe->update($request->validated());

        // Обновление ингредиентов
        $recipe->ingredients()->sync(
            collect($request->ingredients)->mapWithKeys(function ($ingredient) {
                return [
                    $ingredient['ingredient_id'] => [
                        'quantity' => $ingredient['quantity']
                    ]
                ];
            })->toArray()
        );

        // Пересчитываем сложность рецепта
        $recipe->update(['difficulty' => Recipe::calculateDifficulty($recipe)]);

        // Загружаем связанные данные и возвращаем ресурс
        return new RecipeResource($recipe->load([
            'user',
            'category',
            'cookingMethod',
            'country',
            'ingredients',
            'ingredients.unit',
            'recipeSteps',
            'reviews.user']));
    }

    public function destroy(Recipe $recipe): JsonResponse
    {
        // Авторизация
        $this->authorize('delete', $recipe);

        // Удаляем рецепт
        $recipe->delete();

        // Возвращаем успешный ответ с сообщением
        return response()->json(['message' => 'Рецепт був успішно видалений'], 200);
    }
}
