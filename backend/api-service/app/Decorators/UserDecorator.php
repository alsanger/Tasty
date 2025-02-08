<?php

namespace App\Decorators;

use App\Models\User;

class UserDecorator extends BaseDecorator
{
    public function __construct(User $user)
    {
        parent::__construct($user);
    }

    public function toArray(array $excludedFields = []): array
    {
        // Исключаем ненужные поля
        return parent::toArray([
            'email_verified_at',
            'password',
            'remember_token',
            'created_at',
            'updated_at',]);
    }
}
