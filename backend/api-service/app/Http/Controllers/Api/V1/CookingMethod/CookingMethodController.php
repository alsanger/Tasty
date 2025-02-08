<?php

namespace app\Http\Controllers\Api\V1\CookingMethod;

use app\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\CookingMethod\StoreCookingMethodRequest;
use App\Http\Requests\Api\V1\CookingMethod\UpdateCookingMethodRequest;
use App\Http\Resources\Api\V1\CookingMethod\CookingMethodCollection;
use App\Http\Resources\Api\V1\CookingMethod\CookingMethodResource;
use App\Models\CookingMethod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CookingMethodController extends Controller
{
    public function index(): CookingMethodCollection
    {
        $cookingMethods = CookingMethod::query()->paginate(100);
        return new CookingMethodCollection($cookingMethods);
    }

    public function store(StoreCookingMethodRequest $request): CookingMethodResource
    {
        $this->authorize('create', CookingMethod::class);

        $cookingMethod = CookingMethod::create($request->validated());
        return new CookingMethodResource($cookingMethod);
    }

    public function show(CookingMethod $cookingMethod): CookingMethodResource
    {
        return new CookingMethodResource($cookingMethod);
    }

    public function update(UpdateCookingMethodRequest $request, CookingMethod $cookingMethod): CookingMethodResource
    {
        $this->authorize('update', CookingMethod::class);

        $cookingMethod->update($request->validated());
        return new CookingMethodResource($cookingMethod);
    }

    public function destroy(CookingMethod $cookingMethod): JsonResponse
    {
        $this->authorize('delete', CookingMethod::class);

        $cookingMethod->delete();
        // Возвращаем сообщение
        return response()->json(['message' => 'Спосіб приготування був успішно видалений'], 200);
    }
}
