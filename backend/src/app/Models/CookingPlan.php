<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class CookingPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
    ];

    // Связь с пользователем, которому принадлежит план готовки рецептов.
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Связь с рецептами, который планируется приготовить пользователем.
    public function recipes(): BelongsToMany
    {
        return $this->belongsToMany(Recipe::class, 'cooking_plan_recipe')
            ->withPivot('date')
            ->withTimestamps();
    }
}
