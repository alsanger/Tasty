<?php

namespace App\Decorators;

use App\Models\Ingredient;
use App\Models\Unit;

class IngredientDecorator extends BaseDecorator
{
    public function __construct(Ingredient $ingredient)
    {
        parent::__construct($ingredient);
    }

    public function toArray(array $excludedFields = []): array
    {
        // Исключаем ненужные поля
        return parent::toArray([
            'unit_id',
            'created_at',
            'updated_at',]);
    }
}
