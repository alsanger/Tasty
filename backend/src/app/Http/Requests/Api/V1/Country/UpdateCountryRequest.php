<?php

namespace App\Http\Requests\Api\V1\Country;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCountryRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Авторизация: проверка, что пользователь может обновить страну.
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('countries', 'name')->ignore($this->route('country')?->id),
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
