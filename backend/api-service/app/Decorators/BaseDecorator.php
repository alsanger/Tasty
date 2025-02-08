<?php

namespace App\Decorators;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

abstract class BaseDecorator
{
    protected Model $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    // Возвращает значение поля модели, с обработкой дат
    public function getField(string $field)
    {
        if (in_array($field, ['created_at', 'updated_at'])) {
            return Carbon::parse($this->model->{$field})->format('d.m.Y');
        }

        return $this->model->{$field} ?? null;
    }

    // Возвращает данные модели в виде массива, исключая ненужные поля
    public function toArray(array $excludedFields = []): array
    {
        $attributes = $this->model->getAttributes();
        $filteredAttributes = array_diff_key($attributes, array_flip($excludedFields));

        $data = [];
        foreach ($filteredAttributes as $key => $value) {
            $data[$key] = $this->getField($key);
        }

        return $data;
    }
}
