<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\PasswordRecovery\ForgotPasswordRequest;
use App\Http\Requests\Api\V1\PasswordRecovery\ResetPasswordRequest;
use App\Http\Requests\Api\V1\User\LoginRequest;
use App\Http\Resources\Api\V1\User\UserResource;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        // Ищем пользователя по email
        $user = User::where('email', $request->email)->first();

        // Проверяем, что пользователь существует и пароль правильный
        if ($user && Hash::check($request->password, $user->password)) {
            // Проверка блокировки
            if ($user->is_blocked) {
                return response()->json([
                    'message' => 'Ваш акаунт заблокований.',
                ], 403);
            }

            // Удаляем все токены пользователя
            $user->tokens()->delete();

            // Создаем новый токен для пользователя
            $tokenName = $user->email . " API Token";
            $token = $user->createToken($tokenName)->plainTextToken;

            return response()->json([
                'user' => new UserResource($user->load('roles')),
                'token' => $token
            ]);
        }

        return response()->json([
            'message' => 'Email або пароль вказані невірно.',
        ], 401);
    }

    public function logout()
    {
        Auth::user()->tokens()->delete();

        return response()->json([
            'message' => 'Токен видалений.',
        ]);
    }

    // МЕТОДЫ ДЛЯ ВЕРИФИКАЦИИ EMAIL

    // Метод для отображения страницы с подтверждением email
    public function showVerifyEmailPage()
    {
        return view('users.verify-email');
    }

    // Метод для обработки подтверждения email
    public function verifyEmail(EmailVerificationRequest $request)
    {
        $request->fulfill();
        return redirect()->route('index');
    }

    // Метод для отправки повторного уведомления на email
    public function sendVerificationNotification(Request $request)
    {
        $request->user()->sendEmailVerificationNotification();
        return back()->with('message', 'Посилання для підтвердження реєстрації направлено!');
    }

    //МЕТОДЫ ДЛЯ СБРОСА ПАРОЛЯ

    // Метод отправки ссылки для сброса пароля
    public function forgotPassword(ForgotPasswordRequest $request) {
        $status = Password::sendResetLink(
            $request->only('email')
        );

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => __($status)], 200)
            : response()->json(['error' => __($status)], 400);
    }

    // Метод для сброса пароля и получения ссылки на email
    public function resetPassword($token)
    {
        $email = request()->query('email');
        return response()->json([
            'message' => 'Введите новый пароль',
            'email' => $email,
            'token' => $token,
        ]);
    }

    // Метод установления нового паролья пользователя после его сброса
    public function updatePassword(ResetPasswordRequest $request) {
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, $password) {
                $user->forceFill([
                    'password' => $password
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'message' => 'Пароль був успішно змінений.'
            ], 200);
        }

        return response()->json([
            'error' => __($status)  // Используем перевод статуса ошибки
        ], 400);
    }
}
