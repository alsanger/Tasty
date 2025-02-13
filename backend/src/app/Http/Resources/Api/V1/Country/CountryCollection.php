<?php

namespace App\Http\Resources\Api\V1\Country;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class CountryCollection extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection->map(function ($country) {
                return new CountryResource($country);
            }),
            'meta' => [
                'total' => $this->resource->total(), // Дополнительная информация о количестве элементов
            ],
        ];
    }
}
