<?php

namespace App\Http\Resources\Api\V1\Like;

use App\Decorators\RecipeDecorator;
use App\Decorators\LikeDecorator;
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
            'user' => $this->whenLoaded('user', function () {
                $user = (new UserDecorator($this->user))->toArray();
                return array_intersect_key($user, array_flip(['id', 'display_name', 'avatar_url']));
            }),
            'recipe' => $this->whenLoaded('recipe', fn() => (new RecipeDecorator($this->recipe))->toArray()
            ),
        ]);
    }
}
