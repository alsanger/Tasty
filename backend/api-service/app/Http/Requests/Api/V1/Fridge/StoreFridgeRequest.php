<?php

namespace App\Http\Requests\Api\V1\Fridge;

use Illuminate\Foundation\Http\FormRequest;

class StoreFridgeRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Авторизация: проверка, что пользователь может создать холодильник.
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'exists:users,id'],
            'ingredients' => ['array'],
            'ingredients.*.ingredient_id' => ['required', 'exists:ingredients,id'],
            'ingredients.*.quantity' => ['required', 'numeric', 'min:0']
        ];
    }

    /**
     * Get custom attribute names for validator errors.
     *
     * @return array<string, string>
     */
    /*public function attributes(): array
    {
        return [
            'user_id' => 'пользователь',
        ];
    }*/

    /**
     * Get the custom error messages for validation rules.
     *
     * @return array<string, string>
     */
    /*public function messages(): array
    {
        return [
            'user_id.required' => 'Необходимо указать пользователя для холодильника.',
            'user_id.exists' => 'Пользователь не найден.',
        ];
    }*/
}
