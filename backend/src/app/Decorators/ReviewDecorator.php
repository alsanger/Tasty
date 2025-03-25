<?php

namespace App\Decorators;

use App\Models\Review;

class ReviewDecorator extends BaseDecorator
{
    public function __construct(Review $review)
    {
        parent::__construct($review);
    }

    public function toArray(array $excludedFields = []): array
    {
        // Исключаем ненужные поля
        return parent::toArray([
            'updated_at',]);
    }
}
