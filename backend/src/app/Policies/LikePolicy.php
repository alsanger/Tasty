<?php

namespace App\Policies;

use App\Models\Like;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class LikePolicy
{
    // Внутренний метод для проверки, является ли пользователь администратором
    private function isAdmin(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function update(User $user, Like $like): bool
    {
        // Пользователь может измнять свой отзыв, а администратор любой отзыв
        return $user->id === $like->user_id || $this->isAdmin($user);
    }

    public function delete(User $user, Like $like): bool
    {
        // Пользователь может удалить свой отзыв, а администратор любой отзыв
        return $user->id === $like->user_id || $this->isAdmin($user);
    }
}
