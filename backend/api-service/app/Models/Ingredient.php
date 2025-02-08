<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Ingredient extends Model
{
    use HasFactory;

    protected $fillable = [
        'unit_id',
        'name',
        'calories',
    ];

    // Метод для получения единицы измерения ингредиента.
    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    // Метод для получения рецептов, в которых используется ингредиент.
    public function recipes(): BelongsToMany
    {
        return $this->belongsToMany(Recipe::class, 'ingredient_recipe')
            ->withPivot('quantity')
            ->withTimestamps();
    }

    // Метод для получения холодильников, в которых находится ингредиент.
    public function fridges(): BelongsToMany
    {
        return $this->belongsToMany(Fridge::class, 'fridge_ingredient')
            ->withPivot('quantity')
            ->withTimestamps();
    }
}
