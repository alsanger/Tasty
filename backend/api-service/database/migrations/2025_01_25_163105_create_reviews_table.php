<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recipe_id')->constrained()->cascadeOnDelete(); // Внешний ключ на таблицу recipes
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // Внешний ключ на таблицу users
            $table->integer('rating')->unsigned()->check('rating >= 1 AND rating <= 5');
            $table->text('review');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
