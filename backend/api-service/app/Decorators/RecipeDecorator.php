<?php

namespace App\Decorators;

use App\Models\Ingredient;
use App\Models\Recipe;
use App\Models\Unit;

class RecipeDecorator extends BaseDecorator
{
    public function __construct(Recipe $recipe)
    {
        parent::__construct($recipe);
    }

    public function toArray(array $excludedFields = []): array
    {
        // Исключаем ненужные поля
        return parent::toArray([
            'created_at',
            'updated_at',]);
    }
}
