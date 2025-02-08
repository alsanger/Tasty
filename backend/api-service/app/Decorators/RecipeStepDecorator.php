<?php

namespace App\Decorators;

use App\Models\RecipeStep;

class RecipeStepDecorator extends BaseDecorator
{
    public function __construct(RecipeStep $recipeStep)
    {
        parent::__construct($recipeStep);
    }

    public function toArray(array $excludedFields = []): array
    {
        // Исключаем ненужные поля
        return parent::toArray([
            'created_at',
            'updated_at',]);
    }
}
