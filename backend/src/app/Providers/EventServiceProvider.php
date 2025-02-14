<?php

namespace App\Providers;

use App\Events\PasswordResetRequested;
use App\Events\UserDeleted;
use App\Listeners\LogUserDeletion;
use App\Listeners\SendPasswordResetLink;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;
use App\Events\UserRegistered;
use App\Listeners\SendWelcomeEmail;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        UserRegistered::class => [
            SendWelcomeEmail::class,
        ],
        PasswordResetRequested::class => [
            SendPasswordResetLink::class,
        ],
    ];

    public function boot(): void
    {
        //
    }

    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
