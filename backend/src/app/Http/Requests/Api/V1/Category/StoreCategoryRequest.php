<?php

namespace App\Http\Requests\Api\V1\Category;

use Illuminate\Foundation\Http\FormRequest;

class StoreCategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        // Авторизация: проверка, что пользователь может создать категорию.
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
                'unique:categories,name', // Проверка уникальности имени категории
            ],
            'image_url' => [
                'nullable',
                'max:255',
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
            'name' => 'название категории',
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
            'name.required' => 'Необходимо указать название категории.',
            'name.string' => 'Название категории должно быть строкой.',
            'name.max' => 'Название категории не может превышать 255 символов.',
            'name.unique' => 'Категория с таким названием уже существует.',
        ];
    }*/
}
