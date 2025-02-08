<?php

namespace app\Http\Controllers\Api\V1\Review;

use app\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Review\StoreReviewRequest;
use App\Http\Requests\Api\V1\Review\UpdateReviewRequest;
use App\Http\Resources\Api\V1\Review\ReviewCollection;
use App\Http\Resources\Api\V1\Review\ReviewResource;
use App\Models\Review;
use Illuminate\Http\JsonResponse;

class ReviewController extends Controller
{
    public function index(): ReviewCollection
    {
        $reviews = Review::query()
            ->with('recipe', 'user')
            ->paginate(30);

        return new ReviewCollection($reviews);
    }

    public function store(StoreReviewRequest $request): ReviewResource
    {
        // Создание отзыва
        $review = Review::create($request->validated());

        // Используем ReviewResource для возвращения созданного отзыва с связанными пользователями
        return new ReviewResource($review->load('recipe', 'user'));
    }

    public function show(Review $review): ReviewResource
    {
        // Возвращаем форматированный ответ через ReviewResource
        return new ReviewResource($review->load('recipe', 'user'));
    }

    public function update(UpdateReviewRequest $request, Review $review): ReviewResource
    {
        // Авторизация на обновление отзыва
        $this->authorize('update', $review);

        // Обновляем данные отзыва на основе запроса
        $review->update($request->validated());

        // Возвращаем обновленный отзыв через ReviewResource
        return new ReviewResource($review->load('recipe', 'user'));
    }

    public function destroy(Review $review): JsonResponse
    {
        // Проверка прав на удаление отзыва
        $this->authorize('delete', $review);

        // Удаляем отзыв
        $review->delete();

        // Возвращаем успешный ответ
        return response()->json(['message' => 'Відгук був успішно видалений'], 200);
    }
}
