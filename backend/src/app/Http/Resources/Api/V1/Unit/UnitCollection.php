<?php

namespace App\Http\Resources\Api\V1\Unit;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class UnitCollection extends ResourceCollection
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
                return new UnitResource($unit);
            }),
            'meta' => [
                'total' => $this->resource->total(), // Дополнительная информация о количестве элементов
            ],
        ];
    }
}
