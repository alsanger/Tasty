<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Support\Facades\Log;

class UserPolicy
{
    // Внутренний метод для проверки, является ли пользователь администратором
    private function isAdmin(User $user): bool
    {
        return $user->hasRole('admin');
    }

    // ПОЛИТИКИ:
    public function login(User $user): bool
    {
        // Проверяем, не заблокирован ли пользователь
        return !$user->isBlocked();
    }

    public function update(User $user, User $model): bool
    {
        // Пользователь может редактировать информацию только о себе, а администратор о любом пользователе
        return $user->id === $model->id || $this->isAdmin($user);
    }

    public function updateRoles(User $user, User $model): bool
    {
        return $this->isAdmin($user);
    }

    public function delete(User $user, User $model): bool
    {
        // Администратор может удалять любого пользователя, кроме себя
        return $this->isAdmin($user) && $user->id !== $model->id;
    }

    public function follow(User $user, User $targetUser): bool
    {
        // Администратор может создавать любые связи
        if ($this->isAdmin($user)) {
            return true;
        }

        // Для обычных пользователей оставляем существующие правила
        if ($user->id === $targetUser->id) {
            return false;
        }

        if ($targetUser->isBlocked()) {
            return false;
        }

        if ($user->isBlocked()) {
            return false;
        }

        return true;
    }

    public function unfollow(User $user, User $targetUser): bool
    {
        // Администратор может удалять любые связи
        if ($this->isAdmin($user)) {
            return true;
        }

        // Для обычных пользователей проверяем блокировку и наличие связи
        if ($user->isBlocked() || $targetUser->isBlocked()) {
            return false;
        }

        return $user->following->contains($targetUser->id);
    }

    public function viewFollowers(User $user, User $targetUser): bool
    {
        // Администратор может смотреть подписчиков любого пользователя
        if ($this->isAdmin($user)) {
            return true;
        }

        // Пользователь может смотреть своих подписчиков
        if ($user->id === $targetUser->id) {
            return true;
        }

        // Нельзя смотреть подписчиков заблокированного пользователя
        if ($targetUser->isBlocked()) {
            return false;
        }

        // В остальных случаях можно смотреть подписчиков
        return true;
    }

    public function viewFollowing(User $user, User $targetUser): bool
    {
        // Те же правила, что и для просмотра подписчиков
        return $this->viewFollowers($user, $targetUser);
    }

    public function viewRoles(User $user): bool
    {
        // Проверяем, является ли пользователь администратором
        return $this->isAdmin($user);
    }
}
