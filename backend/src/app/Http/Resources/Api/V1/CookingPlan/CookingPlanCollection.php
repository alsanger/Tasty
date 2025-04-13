<?php

namespace App\Http\Resources\Api\V1\CookingPlan;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class CookingPlanCollection extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection->map(function ($cookingPlan) {
                return new CookingPlanResource($cookingPlan);
            }),
            'meta' => [
                'total' => $this->resource->total(), // Дополнительная информация о количестве элементов
            ],
        ];
    }
}
