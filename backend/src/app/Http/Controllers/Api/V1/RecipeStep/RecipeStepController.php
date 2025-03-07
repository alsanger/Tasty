<?php

namespace App\Http\Controllers\Api\V1\RecipeStep;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\RecipeStep\StoreRecipeStepRequest;
use App\Http\Requests\Api\V1\RecipeStep\UpdateRecipeStepRequest;
use App\Http\Resources\Api\V1\RecipeStep\RecipeStepCollection;
use App\Http\Resources\Api\V1\RecipeStep\RecipeStepResource;
use App\Models\Recipe;
use App\Models\RecipeStep;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class RecipeStepController extends Controller
{
    public function index(Recipe $recipe): RecipeStepCollection
    {
        $recipeSteps = $recipe->recipeSteps()->paginate(100);
        return new RecipeStepCollection($recipeSteps);
    }

    public function store(StoreRecipeStepRequest $request): RecipeStepResource
    {
        $recipeId = $request->input('recipe_id');
        $recipe = Recipe::findOrFail($recipeId);

        $this->authorize('create', [RecipeStep::class, $recipe]);

        $recipeStep = RecipeStep::create($request->validated());
        Log::info('Шаг добавлен');
        // Пересчитываем сложность рецепта
        //$recipe->update(['difficulty' => RecipeService::calculateDifficulty($recipe)]);
        //Log::info('Пересчитана сложность рецепта', ['difficulty' => $recipe->difficulty]);

        return new RecipeStepResource($recipeStep);
    }

    public function show(Recipe $recipe, RecipeStep $recipeStep): RecipeStepResource
    {
        return new RecipeStepResource($recipeStep);
    }

    public function update(UpdateRecipeStepRequest $request, RecipeStep $recipeStep): RecipeStepResource
    {
        $this->authorize('update', $recipeStep);

        $recipeStep->update($request->validated());

        return new RecipeStepResource($recipeStep);
    }

    public function destroy(RecipeStep $recipeStep): JsonResponse
    {
        $this->authorize('delete', $recipeStep);

        $recipe = $recipeStep->recipe;

        $recipeStep->delete();

        // Пересчитываем сложность рецепта
        //$recipe->update(['difficulty' => Recipe::calculateDifficulty($recipe)]);

        return response()->json(['message' => 'Крок приготування рецепту успішно видалений'], 200);
    }
}
