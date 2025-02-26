<?php

namespace App\Http\Requests\Api\V1\RecipeStep;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRecipeStepRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Авторизация: проверка, что пользователь может создавать шаги рецепта.
        return true;
    }

    public function rules(): array
    {
        return [
            'recipe_id' => [
                'required',
                'exists:recipes,id',
            ],
            'step_number' => [
                'required',
                'integer',
                'min:1',
                Rule::unique('recipe_steps')
                    ->where(function ($query) {
                        return $query->where('recipe_id', $this->input('recipe_id'));
                    })
            ],
            'description' => [
                'required',
                'string',
                'max:5000',
            ],
            'image_url' => [
                'nullable',
                'max:255',
            ],
        ];
    }

    /*public function attributes(): array
    {
        return [
            'recipe_id' => 'рецепт',
            'step_number' => 'номер шага',
            'description' => 'описание шага',
            'image_url' => 'URL изображения',
        ];
    }

    public function messages(): array
    {
        return [
            'recipe_id.exists' => 'Указанный рецепт не существует.',
            'step_number.required' => 'Номер шага обязателен.',
            'step_number.integer' => 'Номер шага должен быть целым числом.',
            'step_number.unique' => 'Шаг с таким номером уже существует в этом рецепте.',
            'description.required' => 'Описание шага обязательно.',
            'description.string' => 'Описание должно быть строкой.',
            'description.max' => 'Описание не может превышать 5000 символов.',
            'image_url.url' => 'URL изображения должен быть валидным.',
        ];
    }*/
}
