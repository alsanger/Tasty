<?php

namespace App\Http\Resources\Api\V1\Ingredient;

use App\Models\Ingredient;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Decorators\IngredientDecorator;
use App\Decorators\UnitDecorator;

class IngredientResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $ingredient = $this->resource instanceof Ingredient ? $this->resource : $this->resource->resource;

        return array_merge(
            (new IngredientDecorator($ingredient))->toArray(),
            [
                'quantity' => $this->whenLoaded('ingredient_recipe', fn() => $this->pivot->quantity),
                'unit' => $this->whenLoaded('unit', fn() => (new UnitDecorator($this->unit))->toArray()),
            ]
        );
    }
}
