<?php

namespace App\Http\Requests\Api\V1\Unit;

use Illuminate\Foundation\Http\FormRequest;

class StoreUnitRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        // Авторизация: проверка, что пользователь может создавать единицу измерения.
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
            'name' => [
                'required',
                'string',
                'max:255',
                'unique:units,name', // Проверка на уникальность имени единицы измерения
            ],
            'short_name' => [
                'required',
                'string',
                'max:50',
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
            'name' => 'название единицы измерения',
            'short_name' => 'короткое название единицы измерения',
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
            'name.required' => 'Название единицы измерения обязательно.',
            'name.string' => 'Название единицы измерения должно быть строкой.',
            'name.max' => 'Название единицы измерения не может превышать 255 символов.',
            'name.unique' => 'Единица измерения с таким названием уже существует.',
            'short_name.required' => 'Короткое название единицы измерения обязательно.',
            'short_name.string' => 'Короткое название единицы измерения должно быть строкой.',
            'short_name.max' => 'Короткое название единицы измерения не может превышать 50 символов.',
        ];
    }*/
}
