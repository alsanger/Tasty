<?php

namespace App\Http\Requests\Api\V1\Recipe;

use Illuminate\Foundation\Http\FormRequest;

class NewestRecipesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'limit' => ['integer', 'min:1', 'max:100', 'nullable'],
        ];
    }
}
