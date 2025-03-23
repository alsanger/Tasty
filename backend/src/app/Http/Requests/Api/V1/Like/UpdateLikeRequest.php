<?php

namespace App\Http\Requests\Api\V1\Like;

use App\Models\Like;
use Illuminate\Foundation\Http\FormRequest;

class UpdateLikeRequest extends FormRequest
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
            ],
        ];
    }
}
