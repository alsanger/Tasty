<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Unit extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'short_name'
    ];

    // Связь единицы измерения с ингредиентами.
    public function ingredients(): HasMany
    {
        return $this->hasMany(Ingredient::class);
    }
}
