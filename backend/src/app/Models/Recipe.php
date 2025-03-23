<?php

namespace App\Models;

use App\Services\RecipeService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Recipe extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'country_id',
        'category_id',
        'cooking_method_id',
        'name',
        'description',
        'time',
        'difficulty',
        'image_url'
    ];

    // Связь рецепта с пользователем
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Связь рецепта со страной происхождения
    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    // Связь рецепта с категорией
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    // Связь рецепта с способом приготовления
    public function cookingMethod(): BelongsTo
    {
        return $this->belongsTo(CookingMethod::class);
    }

    // Связь рецепта с отзывами
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    // Связь рецепта с лайками
    public function likes(): HasMany
    {
        return $this->hasMany(Like::class);
    }

    // Связь рецепта с ингредиентами
    public function ingredients(): BelongsToMany
    {
        return $this->belongsToMany(Ingredient::class, 'ingredient_recipe')
            ->withPivot('quantity')
            ->withTimestamps();
    }

    // Связь рецепта с шагами его приготовления
    public function recipeSteps(): HasMany
    {
        return $this->hasMany(RecipeStep::class);
    }

    // Связь рецепта с планами приготовления
    public function cookingPlans(): BelongsToMany
    {
        return $this->belongsToMany(CookingPlan::class, 'cooking_plan_recipe')
            ->withPivot('date')
            ->withTimestamps();
    }

    // Статический метод расчета сложности
    /*public static function calculateDifficulty(Recipe $recipe): float
    {
        $ingredientsCount = $recipe->ingredients()->count();
        $cookingTime = $recipe->time ?? 0;
        $stepsCount = max($recipe->recipeSteps()->count(), 1); // Минимум 1 шаг

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
    }*/

    // Хук для автоматического обновления сложности
    protected static function booted(): void
    {
        static::created(function ($recipe) {
            static::withoutEvents(function () use ($recipe) {
                $recipe->update(['difficulty' => RecipeService::calculateDifficulty($recipe)]);
            });
        });

        static::updated(function ($recipe) {
            if (!$recipe->isDirty('difficulty')) {
                static::withoutEvents(function () use ($recipe) {
                    $recipe->update(['difficulty' => RecipeService::calculateDifficulty($recipe)]);
                });
            }
        });
    }
    /*protected static function booted(): void
    {
        static::created(function ($recipe) {
            // Отключаем события для этого обновления чтобы не было зацикливания
            static::withoutEvents(function () use ($recipe) {
                $recipe->update(['difficulty' => self::calculateDifficulty($recipe)]);
            });
        });

        static::updated(function ($recipe) {
            // Проверяем, не было ли изменено поле difficulty
            if (!$recipe->isDirty('difficulty')) {
                static::withoutEvents(function () use ($recipe) {
                    $recipe->update(['difficulty' => self::calculateDifficulty($recipe)]);
                });
            }
        });
    }*/
}
