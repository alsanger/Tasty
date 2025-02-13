<?php

namespace App\Policies;

use App\Models\Recipe;
use App\Models\RecipeStep;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class RecipeStepPolicy
{
    // Внутренний метод для проверки, является ли пользователь администратором
    private function isAdmin(User $user): bool
    {
        return $user->hasRole('admin');
    }

    // ПОЛИТИКИ:
    public function create(User $user, Recipe $recipe): bool
    {
        // Пользователь может добавлять шаги приготовления рецептов только в те рецепты,
        // которые он сам создал, а администратор в любые
        return $user->id === $recipe->user_id || $this->isAdmin($user);
    }

    public function update(User $user, RecipeStep $recipeStep): bool
    {
        // Пользователь может измнять шаги приготовления рецептов только в своих рецептах,
        // а администратор в любых
        return $user->id === $recipeStep->recipe->user_id || $this->isAdmin($user);
    }

    public function delete(User $user, RecipeStep $recipeStep): bool
    {
        // Пользователь может удалять шаги приготовления рецептов только в своих рецептах,
        // а администратор в любых
        return $user->id === $recipeStep->recipe->user_id || $this->isAdmin($user);
    }
}
