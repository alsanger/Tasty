<?php

namespace App\Http\Requests\Api\V1\Review;

use App\Models\Review;
use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
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
                function ($attribute, $value, $fail) {
                    $recipeId = $this->input('recipe_id');
                    if (Review::where('user_id', $value)->where('recipe_id', $recipeId)->exists()) {
                        $fail('Користувач вже залишав відгук на цей рецепт');
                    }
                },
            ],
            'rating' => [
                'required',
                'integer',
                'min:1', // Оценка должна быть не меньше 1
                'max:5', // Оценка должна быть не больше 5
            ],
            'review' => [
                'string',
                'max:5000', // Ограничение на длину отзыва
            ],
        ];
    }

    /*public function attributes(): array
    {
        return [
            'recipe_id' => 'рецепт',
            'user_id' => 'пользователь',
            'rating' => 'оценка',
            'review' => 'отзыв',
        ];
    }

    public function messages(): array
    {
        return [
            'recipe_id.exists' => 'Указанный рецепт не существует.',
            'user_id.exists' => 'Указанный пользователь не существует.',
            'rating.required' => 'Оценка обязательна.',
            'rating.integer' => 'Оценка должна быть целым числом.',
            'rating.min' => 'Оценка должна быть не меньше 1.',
            'rating.max' => 'Оценка должна быть не больше 5.',
            'review.required' => 'Отзыв обязателен.',
            'review.string' => 'Отзыв должен быть строкой.',
            'review.max' => 'Отзыв не может превышать 5000 символов.',
        ];
    }*/
}
