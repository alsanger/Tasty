<?php

namespace App\Decorators;

use App\Models\Like;

class LikeDecorator extends BaseDecorator
{
    public function __construct(Like $like)
    {
        parent::__construct($like);
    }

    public function toArray(array $excludedFields = []): array
    {
        // Исключаем ненужные поля
        return parent::toArray([
            'created_at',
            'updated_at',]);
    }
}
