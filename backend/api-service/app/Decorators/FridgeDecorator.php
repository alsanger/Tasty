<?php

namespace App\Decorators;

use App\Models\Fridge;

class FridgeDecorator extends BaseDecorator
{
    public function __construct(Fridge $fridge)
    {
        parent::__construct($fridge);
    }

    public function toArray(array $excludedFields = []): array
    {
        // Исключаем ненужные поля
        return parent::toArray([
            'created_at',
            'updated_at',]);
    }
}
