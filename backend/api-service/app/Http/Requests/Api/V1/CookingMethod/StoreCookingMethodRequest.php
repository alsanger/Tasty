<?php

namespace App\Http\Requests\Api\V1\CookingMethod;

use Illuminate\Foundation\Http\FormRequest;

class StoreCookingMethodRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                'unique:cooking_methods,name', // Проверка, что имя уникально в таблице cooking_methods
            ],
        ];
    }

    /*public function attributes(): array
    {
        return [
            'name' => 'метод приготування',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Необхідно вказати назву методу приготування',
            'name.unique' => 'Метод приготування з такою назвою вже існує',
        ];
    }*/
}
