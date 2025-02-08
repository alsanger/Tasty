<?php

namespace app\Http\Controllers\Api\V1\User;

use app\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\User\FollowRequest;
use App\Http\Resources\Api\V1\User\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FollowController extends Controller
{
    // Получить подписчиков пользователя
    public function followers(User $user, Request $request)
    {
        $this->authorize('viewFollowers', $user);

        $followers = $user->followers()->paginate($request->per_page ?? 20);

        return UserResource::collection($followers)->map(function ($follower) {
            return array_intersect_key($follower->toArray(request()), array_flip(['id', 'display_name', 'avatar_url']));
        });
    }

    // Получить подписки пользователя
    public function following(User $user, Request $request)
    {
        $this->authorize('viewFollowing', $user);

        $following = $user->following()->paginate($request->per_page ?? 20);

        return UserResource::collection($following)->map(function ($following) {
            return array_intersect_key($following->toArray(request()), array_flip(['id', 'display_name', 'avatar_url']));
        });
    }

    // Подписаться на пользователя
    public function follow(FollowRequest $request): JsonResponse
    {
        $follower = User::findOrFail($request->follower_id);
        $following = User::findOrFail($request->following_id);

        $this->authorize('follow', $following);

        if ($follower->id === $following->id) {
            return response()->json(['message' => 'Неможливо підписатися на самого себе'], 400);
        }

        if ($follower->following()->where('following_id', $following->id)->exists()) {
            return response()->json(['message' => 'Ви вже підписані на цю особу'], 400);
        }

        $follower->following()->attach($following->id);
        return response()->json(['message' => 'Ви успішно підписалися']);
    }

    // Отписаться от пользователя
    /*public function unfollow(FollowRequest $request): JsonResponse
    {
        $follower = User::findOrFail($request->follower_id);
        $following = User::findOrFail($request->following_id);

        $this->authorize('unfollow', $following);

        if (!$follower->following()->where('following_id', $following->id)->exists()) {
            return response()->json(['message' => 'Ви не підписані на цю особу'], 400);
        }

        $follower->following()->detach($following->id);
        return response()->json(['message' => 'Ви успішно відписалися']);
    }*/
    public function unfollow(FollowRequest $request): JsonResponse
    {
        $follower = User::findOrFail($request->follower_id);
        $following = User::findOrFail($request->following_id);

        $this->authorize('unfollow', $following);

        if (!$follower->following->contains($following->id)) {
            return response()->json(['message' => 'Ви не підписані на цю особу'], 400);
        }

        $follower->following()->detach($following->id);
        return response()->json(['message' => 'Ви успішно відписалися']);
    }
}
