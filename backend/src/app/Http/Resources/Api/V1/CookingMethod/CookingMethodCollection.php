<?php

namespace App\Http\Resources\Api\V1\CookingMethod;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class CookingMethodCollection extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection->map(function ($cookingMethod) {
                return new CookingMethodResource($cookingMethod);
            }),
            'meta' => [
                'total' => $this->resource->total(), // Дополнительная информация о количестве элементов
            ],
        ];
    }
}
