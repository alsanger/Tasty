<?php

namespace App\Http\Resources\Api\V1\Fridge;

use App\Decorators\FridgeDecorator;
use App\Decorators\IngredientDecorator;
use App\Decorators\UnitDecorator;
use App\Decorators\UserDecorator;
use App\Models\Fridge;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FridgeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return array_merge(
            (new FridgeDecorator($this->resource instanceof Fridge ? $this->resource : $this->resource->resource))->toArray(),
            [
                'user' => $this->whenLoaded('user', function () {
                    $user = (new UserDecorator($this->user))->toArray();
                    return array_intersect_key($user, array_flip(['id', 'display_name', 'avatar_url']));
                }),
            ],
            [
                'ingredients' => $this->whenLoaded('ingredients', function () {
                    return $this->ingredients->sortBy('name')->values()->map(function ($ingredient) {
                        return array_merge(
                            (new IngredientDecorator($ingredient))->toArray(),
                            [
                                'quantity' => $ingredient->pivot->quantity,
                                'unit' => (new UnitDecorator($ingredient->unit))->toArray()
                            ]
                        );
                    });
                }),
            ]
        );
    }
}
