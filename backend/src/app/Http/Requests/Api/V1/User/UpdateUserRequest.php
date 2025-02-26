<?php

namespace App\Http\Requests\Api\V1\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; //Проверка авторизации реализована через Gate
    }

    public function rules(): array
    {
        return [
            'display_name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('users', 'display_name')->ignore($this->route('user')->id),
            ],
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'phone' => [
                'nullable',
                'max:255',
                Rule::unique('users', 'phone')->ignore($this->route('user')->id),
            ],
            'address' => ['nullable', 'max:255'],
            'birthdate' => [
                'nullable',
                'date',
                'after_or_equal:1900-01-01',
                'before_or_equal:' . now()->subYears(7)->toDateString(),
            ],
            'avatar_url' => ['nullable', 'max:255'],
            'is_blocked' => ['nullable', 'boolean'],
            'roles' => ['array', 'exists:roles,id'], // Проверяем, что это массив и все ID существуют
            'roles.*' => 'exists:roles,id', // Проверяем, что ID ролей существуют

            'email' => [
                'nullable',
                'email',
                function ($attribute, $value, $fail) {
                    if ($value) {
                        $fail('Зміна email не дозволяється.');
                    }
                },
            ],
            'password' => [
                'nullable',
                function ($attribute, $value, $fail) {
                    if ($value) {
                        $fail('Зміна паролю доступна лише через його скидання.');
                    }
                },
            ],

        ];
    }
}
