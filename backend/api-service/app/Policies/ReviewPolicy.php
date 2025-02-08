<?php

namespace App\Policies;

use App\Models\Review;
use App\Models\User;

class ReviewPolicy
{
    // Внутренний метод для проверки, является ли пользователь администратором
    private function isAdmin(User $user): bool
    {
        return $user->hasRole('admin');
    }

    // ПОЛИТИКИ:
    public function update(User $user, Review $review)
    {
        // Пользователь может измнять свой отзыв, а администратор любой отзыв
        return $user->id === $review->user_id || $this->isAdmin($user);
    }

    public function delete(User $user, Review $review)
    {
        // Пользователь может удалить свой отзыв, а администратор любой отзыв
        return $user->id === $review->user_id || $this->isAdmin($user);
    }
}
