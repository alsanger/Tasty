<?php

namespace App\Http\Requests\Api\V1\User;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
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
            'email' => ['required', 'email', 'max:255'],
            'password' => ['required'],
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        // Если ошибки валидации есть для 'email' или 'password', добавляем общую ошибку
        if ($validator->fails()) {
            $validator->errors()->add('email-password-error', 'Email або пароль введені неправильно.');

            $validator->errors()->forget('email');
            $validator->errors()->forget('password');
        }

        // Продолжаем обработку ошибок
        throw new ValidationException($validator);
    }
}
