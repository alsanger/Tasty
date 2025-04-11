<?php

namespace App\Policies;

use App\Models\CookingPlan;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CookingPlanPolicy
{
    // Внутренний метод для проверки, является ли пользователь администратором
    private function isAdmin(User $user): bool
    {
        return $user->hasRole('admin');
    }

    // ПОЛИТИКИ:
    public function viewAny(User $user): bool
    {
        // Проверяем, является ли пользователь администратором
        return $this->isAdmin($user);
    }

    public function view(User $user, CookingPlan $cookingPlan): bool
    {
        // Пользователь может просматривать свой план рецептов приготовления еды, а администратор любой план
        return $user->id === $cookingPlan->user_id || $this->isAdmin($user);
    }

    public function update(User $user, CookingPlan $cookingPlan): bool
    {
        // Пользователь может измнять свой план рецептов приготовления еды, а администратор любой план
        return $user->id === $cookingPlan->user_id || $this->isAdmin($user);
    }

    public function delete(User $user, CookingPlan $cookingPlan): bool
    {
        // Пользователь может удалить свой план рецептов приготовления еды, а администратор любой план
        return $user->id === $cookingPlan->user_id || $this->isAdmin($user);
    }

    public function viewByUser(User $currentUser, User $targetUser): bool
    {
        // Пользователь может просматривать свои планы, а администратор — любые
        return $currentUser->id === $targetUser->id || $this->isAdmin($currentUser);
    }
}
