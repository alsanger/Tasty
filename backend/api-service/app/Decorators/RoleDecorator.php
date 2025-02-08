<?php

namespace App\Decorators;

use App\Models\Role;

class RoleDecorator extends BaseDecorator
{
    public function __construct(Role $role)
    {
        parent::__construct($role);
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

use App\Models\Role;
use Carbon\Carbon;

class RoleDecorator
{
    protected Role $role;

    public function __construct(Role $role)
    {
        $this->role = $role;
    }

    // Возвращает значение указанного поля
    public function getField(string $field)
    {
        if (in_array($field, ['created_at', 'updated_at'])) {
            return Carbon::parse($this->role->{$field})->format('d.m.Y');
        }

        return $this->role->{$field} ?? null;
    }

    public function getUsersWithThisRole()
    {
        return $this->role->users()->paginate(30);
    }

    public function toArray(): array
    {
        return [
            'id' => $this->getField('id'),
            'name' => $this->getField('name'),
            'description' => $this->getField('description'),
            //'created_at' => $this->getField('created_at'),
            //'updated_at' => $this->getField('updated_at'),
        ];
    }
}*/
