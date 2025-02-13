<?php

namespace App\Http\Resources\Api\V1\Ingredient;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class IngredientCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection->map(function ($unit) {
                return new IngredientResource($unit);
            }),
            'meta' => [
                'total' => $this->resource->total(), // Дополнительная информация о количестве элементов
            ],
        ];
    }
}
