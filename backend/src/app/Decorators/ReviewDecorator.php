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
            'created_at',
            'updated_at',]);
    }
}


/*
namespace App\Decorators;

use App\Models\Review;
use Carbon\Carbon;

class ReviewDecorator
{
    protected Review $review;

    public function __construct(Review $review)
    {
        $this->review = $review;
    }

    // Возвращает значение указанного поля
    public function getField(string $field)
    {
        if (in_array($field, ['created_at', 'updated_at'])) {
            return Carbon::parse($this->review->{$field})->format('d.m.Y');
        }

        return $this->review->{$field} ?? null;
    }

    // Преобразование всех данных в массив
    public function toArray(): array
    {
        return [
            'id' => $this->getField('id'),
            'recipient_id' => $this->getField('recipient_id'),
            'reviewer_id' => $this->getField('reviewer_id'),
            'stars' => $this->getField('stars'),
            'review' => $this->getField('review'),
            'created_at' => $this->getField('created_at'),
            'updated_at' => $this->getField('updated_at'),
        ];
    }
}*/
