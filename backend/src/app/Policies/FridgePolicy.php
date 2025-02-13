<?php

namespace App\Policies;

use App\Models\Fridge;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class FridgePolicy
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

    public function view(User $user, Fridge $fridge): bool
    {
        // Пользователь может просматривать свой "холодильник", а администратор любой "холодильник"
        return $user->id === $fridge->user_id || $this->isAdmin($user);
    }

    public function update(User $user, Fridge $fridge): bool
    {
        // Пользователь может изменить свой "холодильник", а администратор любой "холодильник"
        return $user->id === $fridge->user_id || $this->isAdmin($user);
    }

    public function delete(User $user, Fridge $fridge): bool
    {
        // Пользователь может удалить свой "холодильник", а администратор любой "холодильник"
        return $user->id === $fridge->user_id || $this->isAdmin($user);
    }
}
