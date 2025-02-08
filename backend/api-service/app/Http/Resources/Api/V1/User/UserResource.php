<?php

namespace App\Http\Resources\Api\V1\User;

use App\Decorators\UserDecorator;
use App\Http\Resources\Api\V1\Role\RoleCollection;
use App\Http\Resources\Api\V1\Role\RoleResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // Инициализация декоратора
        $decoratedUser = new UserDecorator($this->resource instanceof User ? $this->resource : $this->resource->resource);

        // Используем данные декоратора и дополняем их данными о ролях и токене
        return array_merge(
            $decoratedUser->toArray(),
            [
                'roles' => $this->whenLoaded('roles', fn() =>RoleResource::collection($this->roles)->toArray(request())),
                'followers' => $this->whenLoaded('followers', function () {
                    return [
                        'data' => UserResource::collection($this->followers)->map(function ($follower) {
                            return array_intersect_key($follower->toArray(request()), array_flip(['id', 'display_name', 'avatar_url']));
                        }),
                        'total' => $this->followers()->count(),
                    ];
                }),
                'following' => $this->whenLoaded('following', function () {
                    return [
                        'data' => UserResource::collection($this->following)->map(function ($following) {
                            return array_intersect_key($following->toArray(request()), array_flip(['id', 'display_name', 'avatar_url']));
                        }),
                        'total' => $this->following()->count(),
                    ];
                }),
                'token' => $this->when($this->resource->token ?? null, $this->resource->token),
            ]
        );
    }
}
