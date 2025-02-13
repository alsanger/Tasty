<?php

namespace App\Http\Requests\Api\V1\Country;

use Illuminate\Foundation\Http\FormRequest;

class StoreCountryRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Авторизация: проверка, что пользователь может создать страну.
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                'unique:countries,name', // Проверка, что имя уникально в таблице countries
            ],
        ];
    }

    /*public function attributes(): array
    {
        return [
            'name' => 'назва країни',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Необхідно вказати назву країни',
            'name.unique' => 'Країна з такою назвою вже існує',
        ];
    }*/
}
