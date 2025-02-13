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
                'unique:ingredients,name', // Проверка на уникальность названия ингредиента
            ],
            'calories' => [
                'nullable',
                'numeric',
                'min:0', // Количество калорий должно быть положительным или 0
            ],
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
            'unit_id' => 'единица измерения',
            'name' => 'название',
            'calories' => 'калории',
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
            'unit_id.exists' => 'Указанная единица измерения не существует.',
            'name.required' => 'Название ингредиента обязательно.',
            'name.unique' => 'Ингредиент с таким названием уже существует.',
            'calories.numeric' => 'Количество калорий должно быть числом.',
            'calories.min' => 'Количество калорий не может быть отрицательным.',
        ];
    }*/
}
