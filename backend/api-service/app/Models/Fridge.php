<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Fridge extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
    ];

    // Метод для получения пользователя, которому принадлежит холодильник
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Метод для получения всех ингредиентов в холодильнике
    public function ingredients(): BelongsToMany
    {
        return $this->belongsToMany(Ingredient::class, 'fridge_ingredient')
            ->withPivot('quantity')
            ->withTimestamps();
    }
}
