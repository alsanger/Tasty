<?php

namespace App\Http\Requests\Api\V1\Recipe;

use Illuminate\Foundation\Http\FormRequest;

class TopRecipesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'limit' => ['integer', 'min:1', 'max:100', 'nullable'],
            'days' => ['required', 'integer', 'min:1', 'max:365'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $allowedKeys = ['limit', 'days'];
        $unexpectedKeys = array_diff(array_keys($this->all()), $allowedKeys);
        if (!empty($unexpectedKeys)) {
            abort(422, 'Запит містить недопустимі поля: ' . implode(', ', $unexpectedKeys));
        }
    }
}
