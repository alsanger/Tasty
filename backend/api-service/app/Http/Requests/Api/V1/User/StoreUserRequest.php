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

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
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

    /**
     * Get custom messages for validation errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'display_name.required' => 'Отображаемое имя обязательно для заполнения.',
            'display_name.unique' => 'Это имя уже занято.',
            'display_name.max' => 'Имя не должно превышать 255 символов.',
            'email.required' => 'Email обязателен.',
            'email.email' => 'Пожалуйста, укажите действующий email.',
            'email.unique' => 'Этот email уже зарегистрирован.',
            'password.required' => 'Пароль обязателен.',
            'password.min' => 'Пароль должен содержать минимум 8 символов.',
            'password.confirmed' => 'Подтверждение пароля не совпадает.',
            'phone.unique' => 'Этот номер телефона уже зарегистрирован.',
            'birthdate.date' => 'Введите действительную дату рождения.',
            'birthdate.before_or_equal' => 'Дата рождения должна быть не позднее, чем 7 лет назад.',
            'is_blocked.boolean' => 'Поле блокировки должно быть true или false.',
            'avatar_url.max' => 'Ссылка на аватар не должна превышать 255 символов.',
        ];
    }
}
