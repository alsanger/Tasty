<?php

namespace App\Policies;

use App\Models\Category;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CategoryPolicy
{
    // Внутренний метод для проверки, является ли пользователь администратором
    private function isAdmin(User $user): bool
    {
        return $user->hasRole('admin');
    }

    // ПОЛИТИКИ:
    public function create(User $user): bool
    {
        return $this->isAdmin($user);
    }

    public function update(User $user): bool
    {
        return $this->isAdmin($user);
    }

    public function delete(User $user): bool
    {
        return $this->isAdmin($user);
    }
}
