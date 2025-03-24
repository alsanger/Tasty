<?php

namespace App\Http\Resources\Api\V1\Like;

use App\Decorators\CategoryDecorator;
use App\Decorators\CookingMethodDecorator;
use App\Decorators\CountryDecorator;
use App\Decorators\IngredientDecorator;
use App\Decorators\LikeDecorator;
use App\Decorators\RecipeDecorator;
use App\Decorators\RecipeStepDecorator;
use App\Decorators\ReviewDecorator;
use App\Decorators\UserDecorator;
use App\Models\Like;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LikeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $like = $this->resource instanceof Like ? $this->resource : $this->resource->resource;

        return array_merge((new LikeDecorator($like))->toArray(), [
            'user' => $this->user ? [
                'id' => $this->user->id,
                'display_name' => $this->user->display_name,
                'avatar_url' => $this->user->avatar_url
            ] : null,
            'recipe' => $this->recipe ? array_merge(
                (new RecipeDecorator($this->recipe))->toArray(),
                [
                    'user' => $this->recipe->user ? [
                        'id' => $this->recipe->user->id,
                        'display_name' => $this->recipe->user->display_name,
                        'avatar_url' => $this->recipe->user->avatar_url
                    ] : null,
                    'country' => $this->recipe->country ? (new CountryDecorator($this->recipe->country))->toArray() : null,
                    'category' => $this->recipe->category ? (new CategoryDecorator($this->recipe->category))->toArray() : null,
                    'cooking_method' => $this->recipe->cookingMethod ? (new CookingMethodDecorator($this->recipe->cookingMethod))->toArray() : null,
                    'ingredients' => $this->recipe->ingredients ? $this->recipe->ingredients->map(fn($ingredient) => array_merge(
                        (new IngredientDecorator($ingredient))->toArray(),
                        [
                            'quantity' => $ingredient->pivot->quantity,
                            'unit' => $ingredient->unit->name,
                            'short_name' => $ingredient->unit->short_name
                        ]
                    )) : [],
                    'reviews' => $this->recipe->reviews ? $this->recipe->reviews->map(fn($review) => array_merge(
                        (new ReviewDecorator($review))->toArray(),
                        ['user' => [
                            'display_name' => $review->user->display_name,
                            'avatar_url' => $review->user->avatar_url
                        ]]
                    )) : [],
                    'likes' => $this->recipe->likes ? $this->recipe->likes->map(fn($like) => [
                        'id' => $like->id,
                        'user_id' => $like->user_id,
                        'display_name' => $like->user?->display_name
                    ]) : [],
                    'recipeSteps' => $this->recipe->recipeSteps ? $this->recipe->recipeSteps
                        ->map(fn($step) => (new RecipeStepDecorator($step))->toArray())
                        ->sortBy('step_number')
                        ->values() : [],
                ]
            ) : null,
        ]);
    }
}
