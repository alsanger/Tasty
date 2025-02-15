<?php

namespace App\Providers;

use App\Events\PasswordResetRequestedEvent;
use App\Events\UserDeleted;
use App\Listeners\LogUserDeletion;
use App\Listeners\SendPasswordResetLinkListener;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;
use App\Events\UserRegisteredEvent;
use App\Listeners\SendWelcomeEmailListeners;

class EventServiceProvider extends ServiceProvider
{
/*
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        UserRegisteredEvent::class => [
            SendWelcomeEmailListeners::class,
        ],
        PasswordResetRequestedEvent::class => [
            SendPasswordResetLinkListener::class,
        ],
    ];
*/

    public function boot(): void
    {
        //
    }

    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
