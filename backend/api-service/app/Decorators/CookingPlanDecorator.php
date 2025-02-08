<?php

namespace App\Decorators;

use App\Models\CookingPlan;

class CookingPlanDecorator extends BaseDecorator
{
    public function __construct(CookingPlan $cookingPlan)
    {
        parent::__construct($cookingPlan);
    }

    public function toArray(array $excludedFields = []): array
    {
        // Исключаем ненужные поля
        return parent::toArray([
            'created_at',
            'updated_at',]);
    }
}
