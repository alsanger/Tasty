<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recipes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained(); // Внешний ключ на таблицу users
            $table->foreignId('country_id')->nullable()->constrained(); // Внешний ключ на таблицу countries
            $table->foreignId('category_id')->constrained(); // Внешний ключ на таблицу categories;
            $table->foreignId('cooking_method_id')->constrained(); // Внешний ключ на таблицу cooking_method;
            $table->string('name');
            $table->text('description');
            $table->unsignedInteger('time')->nullable();
            $table->decimal('difficulty', 8, 2)->unsigned()->nullable();
            $table->string('image_url')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recipes');
    }
};
