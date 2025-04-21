<?php

namespace App\Http\Controllers\Api\V1\Ingredient;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Ingredient\StoreIngredientRequest;
use App\Http\Requests\Api\V1\Ingredient\UpdateIngredientRequest;
use App\Http\Resources\Api\V1\Ingredient\IngredientCollection;
use App\Http\Resources\Api\V1\Ingredient\IngredientResource;
use App\Models\Ingredient;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class IngredientController extends Controller
{
    public function index(): IngredientCollection
    {
        $ingredients = Ingredient::query()
            ->orderBy('name')
            ->with('unit')
            ->paginate(10000); // Умышленно установлено большое количество элементов на странице
        return new IngredientCollection($ingredients);
    }

    public function store(StoreIngredientRequest $request): IngredientResource
    {
        $this->authorize('create', Ingredient::class);
Log::info($request);
        $ingredient = Ingredient::create($request->validated());
        return new IngredientResource($ingredient->load('unit'));
    }

    public function show(Ingredient $ingredient): IngredientResource
    {
        return new IngredientResource($ingredient->load('unit'));
    }


    public function update(UpdateIngredientRequest $request, Ingredient $ingredient): IngredientResource
    {
        $this->authorize('update', $ingredient);

        $ingredient->update($request->validated());
        return new IngredientResource($ingredient->load('unit'));
    }

    public function destroy(Ingredient $ingredient): JsonResponse
    {
        $this->authorize('delete', $ingredient);

        $ingredient->delete();

        // Возвращаем сообщение
        return response()->json(['message' => 'Інгредієнт був успішно видалений'], 200);

    }
}
