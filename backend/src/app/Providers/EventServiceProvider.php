<?php

namespace App\Providers;

use App\Events\PasswordResetRequestedEvent;
use App\Events\UserDeleted;
use App\Listeners\LogUserDeletion;
use App\Listeners\SendPasswordResetLinkListener;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;
use App\Events\UserRegisteredEvent;
use App\Listeners\SendWelcomeEmailListeners;
use Illuminate\Support\Facades\Log;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        // Убираем стандартный слушатель отсюда
        // Registered::class => [
        //     SendEmailVerificationNotification::class,
        // ],
        UserRegisteredEvent::class => [
            SendWelcomeEmailListeners::class,
        ],
        PasswordResetRequestedEvent::class => [
            SendPasswordResetLinkListener::class,
        ],
    ];

    public function boot(): void
    {
        // Полностью заменяем обработку события Registered своим кодом
        Event::listen(Registered::class, function ($event) {
            static $processed = [];

            if (isset($processed[$event->user->id])) {
                Log::warning('Попытка повторной отправки верификационного письма пользователю: ' . $event->user->email);
                return false;
            }

            $processed[$event->user->id] = true;
            Log::info('Отправка верификационного письма для пользователя: ' . $event->user->email);

            // Отправляем письмо подтверждения
            $event->user->sendEmailVerificationNotification();

            // Блокируем другие слушатели
            return false;
        }, 0);
    }

    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
