<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail, CanResetPassword
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'display_name',
        'first_name',
        'last_name',
        'middle_name',
        'email',
        'password',
        'phone',
        'address',
        'birthdate',
        'avatar_url',
        'is_blocked',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_blocked' => 'boolean',
        ];
    }

    // Связь пользователя с ролями (многие ко многим)
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class)->withTimestamps();
    }

    // Проверяет, есть ли у пользователя определенная роль
    public function hasRole(string $role): bool
    {
        return $this->roles->contains('name', $role);
    }

    // Проверяем заблокирован ли пользователь
    public function isBlocked(): bool
    {
        return (bool) $this->is_blocked;
    }

    // Связь пользователя с рецептами (один ко многим)
    public function recipes(): HasMany
    {
        return $this->hasMany(Recipe::class);
    }

    // Связь пользователя с отзывами (один ко многим)
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    // Связь пользователя с лайками (один ко многим)
    public function likes(): HasMany
    {
        return $this->hasMany(Like::class);
    }

    // Связь пользователя с планами приготовления (один ко многим)
    public function cookingPlans(): HasMany
    {
        return $this->hasMany(CookingPlan::class);
    }

    // Связь пользователя с холодильником (один к одному)
    public function fridge(): HasOne
    {
        return $this->hasOne(Fridge::class);
    }

    // Получить подписчиков пользователя
    public function followers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'followers', 'following_id', 'follower_id')
            ->withTimestamps();
    }

    // Получить подписки пользователя
    public function following(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'followers', 'follower_id', 'following_id')
            ->withTimestamps();
    }
}
