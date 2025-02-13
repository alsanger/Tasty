<?php

namespace App\Http\Requests\Api\V1\CookingPlan;

use Illuminate\Foundation\Http\FormRequest;

class StoreCookingPlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Авторизация: проверка, что пользователь может создать план приготовления.
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'exists:users,id'], // Проверка, что user_id существует в таблице users
            'recipes' => ['array'],
            'recipes.*.recipe_id' => ['required', 'exists:recipes,id'],
            'recipes.*.date' => ['nullable', 'date'],
        ];
    }

    /*public function attributes(): array
    {
        return [
            'user_id' => 'пользователь',
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'Необходимо указать пользователя для плана приготовления.',
            'user_id.exists' => 'Указанный пользователь не существует.',
        ];
    }*/
}
