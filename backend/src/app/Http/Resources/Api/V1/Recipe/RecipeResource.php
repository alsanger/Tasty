<?php

namespace App\Http\Resources\Api\V1\Recipe;

use App\Decorators\CategoryDecorator;
use App\Decorators\CookingMethodDecorator;
use App\Decorators\CountryDecorator;
use App\Decorators\IngredientDecorator;
use App\Decorators\RecipeDecorator;
use App\Decorators\RecipeStepDecorator;
use App\Decorators\ReviewDecorator;
use App\Decorators\UserDecorator;
use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecipeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $recipe = $this->resource instanceof Recipe ? $this->resource : $this->resource->resource;

        return array_merge((new RecipeDecorator($recipe))->toArray(), [
            'user' => $this->whenLoaded('user', function () {
                $user = (new UserDecorator($this->user))->toArray();
                return array_intersect_key($user, array_flip(['id', 'display_name', 'avatar_url']));
            }),
            'country' => $this->whenLoaded('country', fn() => (new CountryDecorator($this->country))->toArray()
            ),
            'category' => $this->whenLoaded('category', fn() => (new CategoryDecorator($this->category))->toArray()
            ),
            'cooking_method' => $this->whenLoaded('cookingMethod', fn() => (new CookingMethodDecorator($this->cookingMethod))->toArray()
            ),
            'ingredients' => $this->whenLoaded('ingredients', fn() => $this->ingredients->map(fn($ingredient) => array_merge(
                (new IngredientDecorator($ingredient))->toArray(),
                [
                    'quantity' => $ingredient->pivot->quantity,
                    'unit' => $ingredient->unit->name,
                    'short_name' => $ingredient->unit->short_name
                    ]
            ))
            ),
            'reviews' => $this->whenLoaded('reviews', fn() => $this->reviews->map(fn($review) => array_merge(
                (new ReviewDecorator($review))->toArray(),
                ['user' => [
                    'display_name' => $review->user->display_name,
                    'avatar_url' => $review->user->avatar_url
                ]]
            ))
            ),
            'likes' => $this->whenLoaded('likes', fn() => $this->likes->map(fn($like) => [
                'id' => $like->id,
                'user_id' => $like->user_id,
                'display_name' => $like->user?->display_name
            ])),
            'recipeSteps' => $this->whenLoaded('recipeSteps', fn() => $this->recipeSteps
                ->map(fn($step) => (new RecipeStepDecorator($step))->toArray())
                ->sortBy('step_number')
                ->values()
            ),
        ]);
    }
}
