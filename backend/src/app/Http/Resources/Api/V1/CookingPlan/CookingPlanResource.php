<?php
/*
namespace App\Http\Resources\Api\V1\CookingPlan;

use App\Decorators\CookingPlanDecorator;
use App\Decorators\IngredientDecorator;
use App\Decorators\RecipeDecorator;
use App\Decorators\ReviewDecorator;
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
                                }),
                                'reviews' => $recipe->reviews->map(function ($review) {
                                    return array_merge(
                                        (new ReviewDecorator($review))->toArray(),
                                        [
                                            'user' => [
                                                'display_name' => $review->user->display_name,
                                                'avatar_url' => $review->user->avatar_url,
                                            ]
                                        ]
                                    );
                                }),
                            ]
                        );
                    });
                }),
            ]
        );
    }
}*/


namespace App\Http\Resources\Api\V1\CookingPlan;

use App\Decorators\CategoryDecorator;
use App\Decorators\CookingMethodDecorator;
use App\Decorators\CookingPlanDecorator;
use App\Decorators\CountryDecorator;
use App\Decorators\IngredientDecorator;
use App\Decorators\RecipeDecorator;
use App\Decorators\RecipeStepDecorator;
use App\Decorators\ReviewDecorator;
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
                                'user' => $recipe->user ? array_intersect_key(
                                    (new UserDecorator($recipe->user))->toArray(),
                                    array_flip(['id', 'display_name', 'avatar_url'])
                                ) : null,
                                'country' => $recipe->country ? (new CountryDecorator($recipe->country))->toArray() : null,
                                'category' => $recipe->category ? (new CategoryDecorator($recipe->category))->toArray() : null,
                                'cooking_method' => $recipe->cookingMethod ? (new CookingMethodDecorator($recipe->cookingMethod))->toArray() : null,
                                'ingredients' => $recipe->ingredients->map(function ($ingredient) {
                                    return array_merge(
                                        (new IngredientDecorator($ingredient))->toArray(),
                                        [
                                            'quantity' => $ingredient->pivot->quantity ?? null,
                                            'unit' => $ingredient->unit->name ?? null,
                                            'short_name' => $ingredient->unit->short_name ?? null
                                        ]
                                    );
                                }),
                                'reviews' => $recipe->reviews->map(function ($review) {
                                    return array_merge(
                                        (new ReviewDecorator($review))->toArray(),
                                        [
                                            'user' => [
                                                'display_name' => $review->user->display_name,
                                                'avatar_url' => $review->user->avatar_url,
                                            ]
                                        ]
                                    );
                                }),
                                'likes' => $recipe->likes ? $recipe->likes->map(function ($like) {
                                    return [
                                        'id' => $like->id,
                                        'user_id' => $like->user_id,
                                        'display_name' => $like->user?->display_name
                                    ];
                                }) : [],
                                'recipeSteps' => $recipe->recipeSteps ? $recipe->recipeSteps
                                    ->map(function ($step) {
                                        return (new RecipeStepDecorator($step))->toArray();
                                    })
                                    ->sortBy('step_number')
                                    ->values() : [],
                            ]
                        );
                    });
                }),
            ]
        );
    }
}
