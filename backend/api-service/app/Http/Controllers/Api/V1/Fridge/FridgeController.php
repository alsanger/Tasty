<?php

namespace App\Http\Controllers\Api\V1\Fridge;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Fridge\StoreFridgeRequest;
use App\Http\Requests\Api\V1\Fridge\UpdateFridgeRequest;
use App\Http\Resources\Api\V1\Fridge\FridgeCollection;
use App\Http\Resources\Api\V1\Fridge\FridgeResource;
use App\Models\Fridge;
use Illuminate\Http\JsonResponse;

class FridgeController extends Controller
{
    public function index(): FridgeCollection
    {
        $this->authorize('viewAny', Fridge::class);

        $fridges = Fridge::query()
            ->with(['user', 'ingredients.unit'])
            ->paginate(30);

        return new FridgeCollection($fridges);
    }

    public function store(StoreFridgeRequest $request): FridgeResource
    {
        $fridge = Fridge::create([
            'user_id' => $request->user_id
        ]);

        if ($request->has('ingredients')) {
            foreach ($request->ingredients as $ingredientData) {
                $fridge->ingredients()->attach(
                    $ingredientData['ingredient_id'],
                    ['quantity' => $ingredientData['quantity']]
                );
            }
        }

        return new FridgeResource(
            $fridge->load(['user', 'ingredients.unit'])
        );
    }

    public function show(Fridge $fridge): FridgeResource
    {
        $this->authorize('view', $fridge);

        return new FridgeResource(
            $fridge->load(['user', 'ingredients.unit'])
        );
    }

    public function update(UpdateFridgeRequest $request, Fridge $fridge): FridgeResource
    {
        $this->authorize('update', $fridge);

        if ($request->has('ingredients') && is_array($request->ingredients)) {
            // Обновляем связи с ингредиентами
            $syncData = [];

            foreach ($request->ingredients as $ingredientData) {
                if (is_array($ingredientData) && isset($ingredientData['ingredient_id'])) {
                    $syncData[$ingredientData['ingredient_id']] = [
                        'quantity' => $ingredientData['quantity'] ?? 0
                    ];
                }
            }

            $fridge->ingredients()->sync($syncData);
        }

        return new FridgeResource(
            $fridge->load(['user', 'ingredients.unit'])
        );
    }

    public function destroy(Fridge $fridge): JsonResponse
    {
        $this->authorize('delete', $fridge);

        $fridge->delete();

        return response()->json(['message' => 'Холодильник успешно удален'], 200);
    }
}
