<?php

namespace App\Decorators;

use App\Models\Unit;

class UnitDecorator extends BaseDecorator
{
    public function __construct(Unit $unit)
    {
        parent::__construct($unit);
    }

    public function toArray(array $excludedFields = []): array
    {
        // Исключаем ненужные поля
        return parent::toArray([
            'created_at',
            'updated_at',]);
    }
}
