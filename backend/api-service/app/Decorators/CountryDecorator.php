<?php

namespace App\Decorators;

use App\Models\Country;

class CountryDecorator extends BaseDecorator
{
    public function __construct(Country $country)
    {
        parent::__construct($country);
    }

    public function toArray(array $excludedFields = []): array
    {
        // Исключаем ненужные поля
        return parent::toArray([
            'created_at',
            'updated_at',]);
    }
}
