<?php

namespace App\Http\Requests\Api\V1\User;

use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Http\FormRequest;

class CustomEmailVerificationRequest extends FormRequest
{
    /**
     * Пользователь, найденный по ID из маршрута
     */
    protected $user = null;

    /**
     * Определяет, авторизован ли пользователь для этого запроса
     */
    public function authorize(): bool
    {
        // Получаем ID пользователя из маршрута
        $userId = $this->route('id');

        // Находим пользователя
        $this->user = User::find($userId);

        if (!$this->user) {
            return false;
        }

        // Проверяем, совпадает ли hash из URL с hash'ем email пользователя
        return hash_equals(
            $this->route('hash'),
            sha1($this->user->getEmailForVerification())
        );
    }

    /**
     * Правила валидации для запроса
     */
    public function rules(): array
    {
        return [];
    }

    /**
     * Выполняет верификацию email
     */
    public function fulfill(): void
    {
        if (!$this->user->hasVerifiedEmail()) {
            $this->user->markEmailAsVerified();
            event(new Verified($this->user));
        }
    }

    /**
     * Получить пользователя из запроса
     */
    public function resolveUser(): ?User
    {
        return $this->user;
    }
}
