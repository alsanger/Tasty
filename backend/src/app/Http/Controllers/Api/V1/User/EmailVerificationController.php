<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\User\CustomEmailVerificationRequest;
use App\Jobs\SendVerificationEmailJob;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class EmailVerificationController extends Controller
{
    // Проверка статуса верификации
    public function notice(Request $request)
    {
        Log::info("В методе notice - EmailVerificationController");

        $request->validate([
            'email' => 'required|email'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Користувача не знайдено.',
            ], 404);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email підтверджено.',
                'status' => 'verified'
            ]);
        }

        return response()->json([
            'message' => 'Будь ласка, підтвердьте свою електронну адресу.',
            'status' => 'email_verification_required',
        ]);
    }

    // Верификация email
    public function verify(CustomEmailVerificationRequest $request)
    {
        Log::info("В методе verify - EmailVerificationController");
        $request->fulfill();

        $user = $request->resolveUser();

        return response()->json([
            'message' => 'Вашу електронну адресу підтверджено.',
            'status' => 'email_verified',
            'user' => $user
        ]);
    }

    // Отправка ссылки для верификации email
    public function sendVerificationEmail(Request $request)
    {
        Log::info("В методе sendVerificationEmail - EmailVerificationController");

        $request->validate([
            'email' => 'required|email'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Користувача не знайдено.',
            ], 404);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email вже підтверджено.',
            ], 400);
        }

        //$user->sendEmailVerificationNotification();
        dispatch(new SendVerificationEmailJob($user));

        return response()->json([
            'message' => 'Посилання для підтвердження надіслано!',
            'status' => 'verification_email_resent',
        ]);
    }
}
