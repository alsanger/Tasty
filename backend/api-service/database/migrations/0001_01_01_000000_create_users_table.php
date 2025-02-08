<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('display_name');                     // Отображаемое имя
            $table->string('first_name')->nullable();           // Имя
            $table->string('last_name')->nullable();            // Фамилия
            $table->string('middle_name')->nullable();          // Отчество
            $table->string('email')->unique();                  // Почта (уникальное поле)
            $table->timestamp('email_verified_at')->nullable(); // Время подтверждения email
            $table->string('password');                         // Пароль
            $table->string('phone')->unique()->nullable();      // Телефон (уникальное поле)
            $table->string('address', 255)->nullable();  // Адрес
            $table->date('birthdate')->nullable();              // Дата рождения
            $table->string('avatar_url')->nullable();           // Ссылка на аватар
            $table->boolean('is_blocked')->default(false);// Статус блокировки
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
