<?php

namespace App\Http\Requests\Api\V1\Fridge;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFridgeRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Авторизация: проверка, что пользователь может обновить холодильник.
        return true;
    }

    public function rules(): array
    {
        return [
            'ingredients' => ['array'],
            'ingredients.*.ingredient_id' => ['required', 'exists:ingredients,id'],
            'ingredients.*.quantity' => ['required', 'numeric', 'min:0']
        ];
    }

    /*public function attributes(): array
    {
        return [
            'user_id' => 'пользователь',
        ];
    }*/

    /*public function messages(): array
    {
        return [
            'user_id.required' => 'Необходимо указать пользователя для холодильника.',
            'user_id.exists' => 'Пользователь не найден.',
        ];
    }*/
}
