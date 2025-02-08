<?php

namespace App\Http\Requests\Api\V1\Recipe;

use Illuminate\Foundation\Http\FormRequest;

class StoreRecipeRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Авторизация: проверка, что пользователь может создавать рецепт.
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => [
                'nullable',
                'exists:users,id', // Проверка, что user_id существует в таблице users, если оно не null
            ],
            'country_id' => [
                'nullable',
                'exists:countries,id', // Проверка, что country_id существует в таблице countries, если оно не null
            ],
            'category_id' => [
                'required',
                'exists:categories,id', // Проверка, что category_id существует в таблице categories
            ],
            'cooking_method_id' => [
                'required',
                'exists:cooking_methods,id', // Проверка, что cooking_method_id существует в таблице cooking_methods
            ],
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'description' => [
                'required',
                'string', // Описание должно быть строкой
            ],
            'time' => [
                'nullable',
                'integer', // Время должно быть целым числом
            ],
            'image_url' => [
                'nullable',
                'url', // Проверка, что URL изображения корректен
                'max:255',
            ],
            'ingredients' => [
                'array',
                'min:1', // Убедитесь, что хотя бы один элемент есть
            ],
            'ingredients.*.ingredient_id' => [
                'required',
                'exists:ingredients,id', // Проверка, что ingredient_id существует в таблице ingredients
            ],
            'ingredients.*.quantity' => [
                'required',
                'integer', // Проверка, что количество является целым числом
                'min:1', // Минимальное количество должно быть 1
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
            'user_id' => 'пользователь',
            'country_id' => 'страна',
            'category_id' => 'категория',
            'name' => 'название',
            'description' => 'описание',
            'time' => 'время',
            'image_url' => 'URL изображения',
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
            'user_id.exists' => 'Пользователь с указанным ID не найден.',
            'country_id.exists' => 'Страна с указанным ID не найдена.',
            'category_id.exists' => 'Категория с указанным ID не найдена.',
            'name.required' => 'Название рецепта обязательно.',
            'name.string' => 'Название должно быть строкой.',
            'name.max' => 'Название не может превышать 255 символов.',
            'name.unique' => 'Рецепт с таким названием уже существует.',
            'description.required' => 'Описание рецепта обязательно.',
            'description.string' => 'Описание должно быть строкой.',
            'time.integer' => 'Время должно быть целым числом.',
            'image_url.url' => 'URL изображения должен быть валидным.',
        ];
    }*/
}
