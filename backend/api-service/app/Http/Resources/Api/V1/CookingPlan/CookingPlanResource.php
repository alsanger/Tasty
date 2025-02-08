<?php

namespace App\Http\Resources\Api\V1\CookingPlan;

use App\Decorators\CookingPlanDecorator;
use App\Decorators\IngredientDecorator;
use App\Decorators\RecipeDecorator;
use App\Decorators\UnitDecorator;
use App\Decorators\UserDecorator;
use App\Models\CookingPlan;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CookingPlanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return array_merge(
            (new CookingPlanDecorator($this->resource instanceof CookingPlan ? $this->resource : $this->resource->resource))->toArray(),
            [
                'user' => $this->whenLoaded('user', function () {
                    $user = (new UserDecorator($this->user))->toArray();
                    return array_intersect_key($user, array_flip(['id', 'display_name', 'avatar_url']));
                }),
            ],
            [
                'recipes' => $this->whenLoaded('recipes', function () {
                    return $this->recipes->map(function ($recipe) {
                        return array_merge(
                            (new RecipeDecorator($recipe))->toArray(),
                            [
                                'date' => $recipe->pivot->date ?? null,
                                'ingredients' => $recipe->ingredients->map(function ($ingredient) {
                                    return array_merge(
                                        (new IngredientDecorator($ingredient))->toArray(),
                                        ['unit' => (new UnitDecorator($ingredient->unit))->toArray()]
                                    );
                                })
                            ]
                        );
                    });
                }),
            ]
        );
    }
}
