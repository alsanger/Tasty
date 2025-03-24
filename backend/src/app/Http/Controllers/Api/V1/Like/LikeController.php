<?php

namespace App\Http\Controllers\Api\V1\Like;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Like\StoreLikeRequest;
use App\Http\Requests\Api\V1\Like\UpdateLikeRequest;
use App\Http\Resources\Api\V1\Like\LikeCollection;
use App\Http\Resources\Api\V1\Like\LikeResource;
use App\Models\Like;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LikeController extends Controller
{
    public function index(): LikeCollection
    {
        $likes = Like::query()
            ->with([
                'recipe' => function($query) {
                    $query->with([
                        'user',
                        'category',
                        'cookingMethod',
                        'country',
                        'ingredients',
                        'ingredients.unit',
                        'recipeSteps',
                        'reviews.user',
                        'likes.user'
                    ]);
                },
                'user'
            ])
            ->paginate(30);

        return new LikeCollection($likes);
    }

    public function store(StoreLikeRequest $request): LikeResource
    {
        Log::info("User with id {$request->user()->id} created a like");
        $like = Like::create($request->validated());

        return new LikeResource($like->load([
            'recipe' => function($query) {
                $query->with([
                    'user',
                    'category',
                    'cookingMethod',
                    'country',
                    'ingredients',
                    'ingredients.unit',
                    'recipeSteps',
                    'reviews.user',
                    'likes.user'
                ]);
            },
            'user'
        ]));
    }

    public function show(Like $like): LikeResource
    {
        return new LikeResource($like->load([
            'recipe' => function($query) {
                $query->with([
                    'user',
                    'category',
                    'cookingMethod',
                    'country',
                    'ingredients',
                    'ingredients.unit',
                    'recipeSteps',
                    'reviews.user',
                    'likes.user'
                ]);
            },
            'user'
        ]));
    }

    public function update(UpdateLikeRequest $request, Like $like): LikeResource
    {
        // Авторизация на обновление отзыва
        $this->authorize('update', $like);

        $like->update($request->validated());

        return new LikeResource($like->load([
            'recipe' => function($query) {
                $query->with([
                    'user',
                    'category',
                    'cookingMethod',
                    'country',
                    'ingredients',
                    'ingredients.unit',
                    'recipeSteps',
                    'reviews.user',
                    'likes.user'
                ]);
            },
            'user'
        ]));
    }

    public function destroy(Like $like)
    {
        // Авторизация на обновление отзыва
        $this->authorize('delete', $like);

        $like->delete();

        // Возвращаем успешный ответ
        return response()->json(['message' => 'Лайк був успішно видалений'], 200);
    }

    public function likesByRecipe($id): LikeCollection
    {
        $likes = Like::query()
            ->where('recipe_id', $id)
            ->with([
                'recipe' => function($query) {
                    $query->with([
                        'user',
                        'category',
                        'cookingMethod',
                        'country',
                        'ingredients',
                        'ingredients.unit',
                        'recipeSteps',
                        'reviews.user',
                        'likes.user'
                    ]);
                },
                'user'
            ])
            ->paginate(30);

        return new LikeCollection($likes);
    }

    public function likesByUser($id): LikeCollection
    {
        $likes = Like::query()
            ->where('user_id', $id)
            ->with([
                'recipe' => function($query) {
                    $query->with([
                        'user',
                        'category',
                        'cookingMethod',
                        'country',
                        'ingredients',
                        'ingredients.unit',
                        'recipeSteps',
                        'reviews.user',
                        'likes.user'
                    ]);
                },
                'user'
            ])
            ->paginate(30);

        return new LikeCollection($likes);
    }
}
