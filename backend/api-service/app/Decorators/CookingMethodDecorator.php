<?php

namespace App\Decorators;

use App\Models\CookingMethod;

class CookingMethodDecorator extends BaseDecorator
{
    public function __construct(CookingMethod $cookingMethod)
    {
        parent::__construct($cookingMethod);
    }

    public function toArray(array $excludedFields = []): array
    {
        // Исключаем ненужные поля
        return parent::toArray([
            'created_at',
            'updated_at',]);
    }
}
