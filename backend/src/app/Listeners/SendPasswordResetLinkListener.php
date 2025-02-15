<?php

namespace App\Listeners;

use App\Events\PasswordResetRequestedEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;

/*class SendPasswordResetLinkListener implements ShouldQueue
{
    use InteractsWithQueue;

    public $tries = 3;
    public $timeout = 60;

    public function handle(PasswordResetRequestedEvent $event)
    {
        Password::sendResetLink(
            ['email' => $event->user->email]
        );
    }
}*/

class SendPasswordResetLinkListener implements ShouldQueue
{
    // use InteractsWithQueue;

    public function handle(PasswordResetRequestedEvent $event)
    {
        Log::info('SendPasswordResetLinkListener handle method started.'); // Логируем начало выполнения
        Log::info('APP_URL: ' . config('app.url')); // Логируем APP_URL

        $token = Password::createToken($event->user);
        $resetUrl = config('app.url') . '/api/v1/reset-password/' . $token . '?email=' . urlencode($event->user->email);

        Log::info('Reset URL: ' . $resetUrl); // Логируем ссылку

        // Отправка email с полным URL
        Mail::send('emails.reset-password', ['resetUrl' => $resetUrl], function($message) use ($event) {
            $message->to($event->user->email)
                ->subject('Reset Password Notification');
        });

        Log::info('Email sent successfully.'); // Логируем успешную отправку
    }
}
