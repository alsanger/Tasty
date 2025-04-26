<?php

namespace App\Listeners;

use App\Events\UserRegisteredEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Log;

class SendWelcomeEmailListeners implements ShouldQueue
{
    use InteractsWithQueue;

    public $tries = 3;
    public $timeout = 60;

    public function handle(UserRegisteredEvent $event)
    {
        //event(new Registered($event->user));
        Log::info('Отправка приветственного письма для пользователя: ' . $event->user->email);
    }

    public function failed(UserRegisteredEvent $event, \Throwable $exception)
    {
        Log::error('Ошибка при отправке приветственного email', [
            'user_id' => $event->user->id,
            'error' => $exception->getMessage()
        ]);
    }
}
