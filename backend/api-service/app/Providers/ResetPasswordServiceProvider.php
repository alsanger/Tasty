<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Auth\Notifications\ResetPassword;

class ResetPasswordServiceProvider extends ServiceProvider
{
    public function boot()
    {
        ResetPassword::createUrlUsing(function ($user, string $token) {
            return env('APP_URL') . '/api/v1/reset-password/' . $token . '?email=' . urlencode($user->email);
        });
    }
}
