<?php

namespace App\Http\Requests\Api\V1\Review;

use App\Models\Review;
use Illuminate\Foundation\Http\FormRequest;

class UpdateReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Авторизация: проверка, что пользователь может обновить свой отзыв.
        return true;
    }

    public function rules(): array
    {
        return [
            'recipe_id' => [
                'required',
                'exists:recipes,id', // Проверка, что рецепт существует
            ],
            'user_id' => [
                'required',
                'exists:users,id', // Проверка, что пользователь существует
            ],
            'rating' => [
                'required',
                'integer',
                'min:1', // Оценка должна быть не меньше 1
                'max:5', // Оценка должна быть не больше 5
            ],
            'review' => [
                'required',
                'string',
                'max:5000', // Ограничение на длину отзыва
            ],
        ];
    }

    /*public function attributes(): array
    {
        return [
            'rating' => 'оценка',
            'review' => 'отзыв',
        ];
    }

    public function messages(): array
    {
        return [
            'rating.required' => 'Оценка обязательна.',
            'rating.integer' => 'Оценка должна быть целым числом.',
            'rating.min' => 'Оценка должна быть не меньше 1.',
            'rating.max' => 'Оценка должна быть не больше 5.',
            'review.required' => 'Отзыв обязателен.',
            'review.string' => 'Отзыв должен быть строкой.',
            'review.max' => 'Отзыв не может превышать 5000 символов.',
        ];
    }*/

    protected function prepareForValidation()
    {
        // Разрешённые поля
        $allowedKeys = ['rating', 'review'];

        // Определяем недопустимые ключи
        $unexpectedKeys = array_diff(array_keys($this->all()), $allowedKeys);

        // Если есть недопустимые ключи, выбрасываем исключение
        if (!empty($unexpectedKeys)) {
            abort(422, 'Запит містить недопустимі для зміни поля: ' . implode(', ', $unexpectedKeys));
        }
    }
}
