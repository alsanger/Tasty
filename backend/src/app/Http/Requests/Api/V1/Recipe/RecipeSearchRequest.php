<?php

namespace App\Http\Requests\Api\V1\Recipe;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RecipeSearchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['string', 'nullable'],
            'ingredients_include' => ['array', 'nullable'],
            'ingredients_exclude' => ['array', 'nullable'],
            'ingredients_only' => ['array', 'nullable'],
            'min_calories' => ['numeric', 'nullable'],
            'max_calories' => ['numeric', 'nullable'],
            'categories' => ['array', 'nullable'],
            'countries' => ['array', 'nullable'],
            'cooking_methods' => ['array', 'nullable'],
            'min_rating' => ['numeric', 'min:1', 'max:5', 'nullable'],
            'min_time' => ['integer', 'nullable'],
            'max_time' => ['integer', 'nullable'],
            'min_difficulty' => ['integer', 'min:1', 'max:10', 'nullable'],
            'max_difficulty' => ['integer', 'min:1', 'max:10', 'nullable'],
            'fridge' => ['boolean', 'nullable'],
            'order_by' => ['string', 'in:name,rating,calories,time,difficulty', 'nullable'],
            'order_direction' => ['string', 'in:asc,desc', 'nullable'],
            'page' => ['integer', 'nullable'],
            'per_page' => ['integer', 'min:1', 'max:100', 'nullable'],
        ];
    }
}
