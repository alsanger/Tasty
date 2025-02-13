<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Country extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    // Связь страны с рецептами
    public function recipes(): HasMany
    {
        return $this->hasMany(Recipe::class);
    }
}
