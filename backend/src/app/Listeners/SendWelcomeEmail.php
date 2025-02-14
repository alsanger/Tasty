<?php

namespace App\Listeners;

namespace App\Listeners;

use App\Events\UserRegistered;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Log;

class SendWelcomeEmail implements ShouldQueue
{
    use InteractsWithQueue;

    public $tries = 3;
    public $timeout = 60;

    public function handle(UserRegistered $event)
    {
        event(new Registered($event->user));
    }

    public function failed(UserRegistered $event, \Throwable $exception)
    {
        Log::error('Ошибка при отправке приветственного email', [
            'user_id' => $event->user->id,
            'error' => $exception->getMessage()
        ]);
    }
}
