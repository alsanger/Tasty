<?php

namespace App\Policies;

use App\Models\Recipe;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class RecipePolicy
{
    // Внутренний метод для проверки, является ли пользователь администратором
    private function isAdmin(User $user): bool
    {
        return $user->hasRole('admin');
    }

    // ПОЛИТИКИ:
    public function update(User $user, Recipe $recipe): bool
    {
        return $user->id === $recipe->user_id || $this->isAdmin($user);
    }

    public function delete(User $user, Recipe $recipe): bool
    {
        return $user->id === $recipe->user_id || $this->isAdmin($user);
    }
}
