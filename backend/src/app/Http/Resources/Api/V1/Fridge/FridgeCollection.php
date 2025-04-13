<?php

namespace App\Http\Resources\Api\V1\Fridge;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class FridgeCollection extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection->map(function ($fridge) {
                return new FridgeResource($fridge);
            }),
            'meta' => [
                'total' => $this->resource->total(), // Дополнительная информация о количестве элементов
            ],
        ];
    }
}
