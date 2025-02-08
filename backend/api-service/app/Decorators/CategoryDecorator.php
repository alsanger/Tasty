<?php

namespace App\Decorators;

use App\Models\Category;

class CategoryDecorator extends BaseDecorator
{
    public function __construct(Category $category)
    {
        parent::__construct($category);
    }

    public function toArray(array $excludedFields = []): array
    {
        // Исключаем ненужные поля
        return parent::toArray([
            'created_at',
            'updated_at',]);
    }
}
