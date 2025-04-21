<?php

namespace App\Http\Requests\Api\V1\Ingredient;

use Illuminate\Foundation\Http\FormRequest;

class StoreIngredientRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        // Авторизация: проверка, что пользователь может создавать ингредиенты.
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'unit_id' => [
                'nullable',
                'exists:units,id', // Проверка, что unit_id существует в таблице units, если оно не null
            ],
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'unit_weight' => [
                'nullable',
                'numeric',
                'min:0', // Количество должно быть положительным или 0
            ],
            'calories' => [
                'nullable',
                'numeric',
                'min:0', // Количество калорий должно быть положительным или 0
            ],
        ];
    }
}
