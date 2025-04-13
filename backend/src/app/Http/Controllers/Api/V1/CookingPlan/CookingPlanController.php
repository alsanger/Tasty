<?php

namespace App\Http\Controllers\Api\V1\CookingPlan;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\CookingPlan\StoreCookingPlanRequest;
use App\Http\Requests\Api\V1\CookingPlan\UpdateCookingPlanRequest;
use App\Http\Resources\Api\V1\CookingPlan\CookingPlanCollection;
use App\Http\Resources\Api\V1\CookingPlan\CookingPlanResource;
use App\Models\CookingPlan;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class CookingPlanController extends Controller
{
    public function index(): CookingPlanCollection
    {
        $this->authorize('viewAny', CookingPlan::class);

        $cookingPlans = CookingPlan::query()
            ->with(['user', 'recipes', 'recipes.ingredients', 'recipes.ingredients.unit'])
            ->paginate(30);

        return new CookingPlanCollection($cookingPlans);
    }

    public function store(StoreCookingPlanRequest $request): CookingPlanResource
    {
        $cookingPlan = CookingPlan::create($request->validated());

        if ($request->has('recipes') && is_array($request->recipes)) {
            foreach ($request->recipes as $recipeData) {
                if (is_array($recipeData) && isset($recipeData['recipe_id'])) {
                    $cookingPlan->recipes()->attach(
                        $recipeData['recipe_id'],
                        ['date' => $recipeData['date'] ?? null]
                    );
                }
            }
        }

        return new CookingPlanResource(
            $cookingPlan->load(['user', 'recipes', 'recipes.ingredients', 'recipes.ingredients.unit'])
        );
    }

    public function show(CookingPlan $cookingPlan): CookingPlanResource
    {
        $this->authorize('view', $cookingPlan);

        return new CookingPlanResource(
            $cookingPlan->load(['user', 'recipes', 'recipes.ingredients', 'recipes.ingredients.unit'])
        );
    }

    public function update(UpdateCookingPlanRequest $request, CookingPlan $cookingPlan): CookingPlanResource
    {
        $this->authorize('update', $cookingPlan);

        if ($request->has('recipes') && is_array($request->recipes)) {
            // Сначала удалим все существующие связи
            $cookingPlan->recipes()->detach();

            // Теперь добавим новые связи
            foreach ($request->recipes as $recipeData) {
                if (is_array($recipeData) && isset($recipeData['recipe_id'])) {
                    $cookingPlan->recipes()->attach($recipeData['recipe_id'], [
                        'date' => $recipeData['date'] ?? null
                    ]);
                }
            }
        }

        return new CookingPlanResource(
            $cookingPlan->load([
                'user',
                'recipes' => function ($query) {
                    $query->withPivot('date');
                },
                'recipes.ingredients',
                'recipes.ingredients.unit'
            ])
        );
    }

    public function destroy(CookingPlan $cookingPlan): JsonResponse
    {
        $this->authorize('delete', $cookingPlan);

        $cookingPlan->delete();

        return response()->json(['message' => 'План пприготування їжі був успішно видалений'], 200);
    }

    public function  cookingPlansByUser(User $user): CookingPlanCollection
    {
        $this->authorize('viewByUser', [CookingPlan::class, $user]);

        $cookingPlans = CookingPlan::query()
            ->where('user_id', $user->id)
            ->with(['user', 'recipes', 'recipes.ingredients', 'recipes.ingredients.unit', 'recipes.reviews'])
            ->paginate(30);

        return new CookingPlanCollection($cookingPlans);
    }
}
