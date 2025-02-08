<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'recipe_id',
        'user_id',
        'rating',
        'review',
    ];

    // Связь отзыва с рецептом
    public function recipe(): BelongsTo
    {
        return $this->belongsTo(Recipe::class);
    }

    // Связь отзыва с пользователем, который его написал
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
