<?php

namespace App\Http\Requests\Api\V1\User;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'display_name' => ['required', 'string', 'unique:users', 'max:255'],
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users', 'max:255'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'phone' => ['nullable', 'max:255', 'unique:users'],
            'address' => ['nullable', 'max:255'],
            'birthdate' => [
                'nullable',
                'date',
                'after_or_equal:1900-01-01',
                'before_or_equal:' . now()->subYears(7)->toDateString(),
            ],
            'avatar_url' => ['nullable', 'url', 'max:255'],
            'is_blocked' => ['nullable', 'boolean'],
            'roles' => ['array', 'exists:roles,id'], // Проверяем, что это массив и все ID существуют
            'roles.*' => 'exists:roles,id', // Проверяем, что ID ролей существуют
        ];
    }

    public function messages(): array
    {
        return [
            'display_name.required' => 'Відображуване ім\'я обов\'язкове для заповнення.',
            'display_name.unique' => 'Це ім\'я вже зайняте.',
            'display_name.max' => 'Ім\'я не повинно перевищувати 255 символів.',
            'email.required' => 'Email обов\'язковий.',
            'email.email' => 'Будь ласка, вкажіть дійсний email.',
            'email.unique' => 'Цей email вже зареєстрований.',
            'password.required' => 'Пароль обов\'язковий.',
            'password.min' => 'Пароль має містити щонайменше 8 символів.',
            'password.confirmed' => 'Підтвердження пароля не збігається.',
            'phone.unique' => 'Цей номер телефону вже зареєстрований.',
            'birthdate.date' => 'Введіть дійсну дату народження.',
            'birthdate.before_or_equal' => 'Дата народження має бути не пізніше, ніж 7 років тому.',
            'is_blocked.boolean' => 'Поле блокування має бути true або false.',
            'avatar_url.max' => 'Посилання на аватар не повинно перевищувати 255 символів.',
        ];

    }
}
