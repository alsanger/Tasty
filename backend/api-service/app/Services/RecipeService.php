<?php

namespace App\Services;

use App\Models\Recipe;

class RecipeService
{
    public static function calculateDifficulty(Recipe $recipe): float
    {
        $ingredientsCount = $recipe->ingredients()->count();
        $cookingTime = $recipe->time ?? 0;
        $stepsCount = max($recipe->recipeSteps()->count(), 1);  // Минимум 1 шаг

        // Базовые коэффициенты с учетом реальной кулинарной практики
        $difficulty = (
            ($ingredientsCount * 0.4) +   // Количество ингредиентов - ключевой фактор
            ($cookingTime / 15 * 0.3) +   // Время приготовления
            ($stepsCount * 0.3)           // Количество шагов
        );

        // Добавляем базовую сложность, если рецепт слишком простой
        if ($ingredientsCount <= 2 && $cookingTime <= 30 && $stepsCount <= 2) {
            $difficulty += 1; // Минимальная базовая сложность
        }

        // Масштабирование до 10
        $scaledDifficulty = min(max($difficulty, 1.5), 10);

        return round($scaledDifficulty, 1);
    }

    public static function calculateRating(Recipe $recipe): float
    {
        $reviews = $recipe->reviews;
        $totalReviews = $reviews->count();

        if ($totalReviews === 0) {
            return 0;
        }

        $averageRating = $reviews->avg('rating');
        $minReviewsForConfidence = 10;
        $defaultRating = 3.0;

        return ($averageRating * $totalReviews + $defaultRating * $minReviewsForConfidence) /
            ($totalReviews + $minReviewsForConfidence);
    }
}
