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
                'exists:users,id',
            ],
            'country_id' => [
                'nullable',
                'exists:countries,id',
            ],
            'category_id' => [
                'required',
                'exists:categories,id',
            ],
            'cooking_method_id' => [
                'required',
                'exists:cooking_methods,id',
            ],
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'description' => [
                'required',
                'string',
            ],
            'time' => [
                'nullable',
                'integer',
            ],
            'image_url' => [
                'nullable',
                'max:255',
            ],
            'image' => [
                'nullable',
                'file',
                'mimes:jpg,jpeg,png,gif,webp,bmp,svg',
                'max:5120', // 5MB максимальный размер
            ],
            'ingredients' => [
                'array',
                'min:1',
            ],
            'ingredients.*.ingredient_id' => [
                'required',
                'exists:ingredients,id',
            ],
            'ingredients.*.quantity' => [
                'required',
                'integer',
                'min:1',
            ],

            // Правила для шагов приготовления с поддержкой загрузки файлов
            'recipeSteps' => [
                'sometimes',
                'array',
            ],
            'recipeSteps.*.description' => [
                'required',
                'string',
                'max:5000',
            ],
            'recipeSteps.*.image_url' => [
                'nullable',
                'max:255',
            ],
            'recipeSteps.*.image' => [
                'nullable',
                'file',
                'mimes:jpg,jpeg,png,gif,webp,bmp,svg',
                'max:5120',
            ],
        ];
    }

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
