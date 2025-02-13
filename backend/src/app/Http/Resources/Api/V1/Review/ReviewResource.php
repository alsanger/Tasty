<?php

namespace App\Http\Resources\Api\V1\Review;

use App\Decorators\RecipeDecorator;
use App\Decorators\ReviewDecorator;
use App\Decorators\UserDecorator;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $review = $this->resource instanceof Review ? $this->resource : $this->resource->resource;

        return array_merge((new ReviewDecorator($review))->toArray(), [
            'user' => $this->whenLoaded('user', function () {
                $user = (new UserDecorator($this->user))->toArray();
                return array_intersect_key($user, array_flip(['id', 'display_name', 'avatar_url']));
            }),
            'recipe' => $this->whenLoaded('recipe', fn() => (new RecipeDecorator($this->recipe))->toArray()
            ),
        ]);
    }
}
