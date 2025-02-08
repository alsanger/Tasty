<?php

namespace app\Http\Controllers\Api\V1\Unit;

use app\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Unit\StoreUnitRequest;
use App\Http\Requests\Api\V1\Unit\UpdateUnitRequest;
use App\Http\Resources\Api\V1\Unit\UnitCollection;
use App\Http\Resources\Api\V1\Unit\UnitResource;
use App\Models\Unit;
use Illuminate\Http\JsonResponse;

class UnitController extends Controller
{
    public function index(): UnitCollection
    {
        $units = Unit::query()->paginate(100);
        return new UnitCollection($units);
    }

    public function store(StoreUnitRequest $request): UnitResource
    {
        $this->authorize('create', Unit::class);

        $unit = Unit::create($request->validated());
        return new UnitResource($unit);
    }

    public function show(Unit $unit): UnitResource
    {
        return new UnitResource($unit);
    }

    public function update(UpdateUnitRequest $request, Unit $unit): UnitResource
    {
        $this->authorize('update', Unit::class);

        $unit->update($request->validated());
        return new UnitResource($unit);
    }

    public function destroy(Unit $unit): JsonResponse
    {
        $this->authorize('delete', Unit::class);

        $unit->delete();
        // Возвращаем сообщение
        return response()->json(['message' => 'Одиниця виміру була успішно видалена'], 200);
    }
}
