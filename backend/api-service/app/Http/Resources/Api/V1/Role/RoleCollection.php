<?php

namespace App\Http\Resources\Api\V1\Role;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class RoleCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection->map(function ($role) {
                return new RoleResource($role);
            }),
            'meta' => [
                'total' => $this->collection->count(), // Дополнительная информация о количестве элементов
            ],
        ];
    }
}
