<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fridge_ingredient', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fridge_id')->constrained()->cascadeOnDelete(); // Ссылка на холодильник
            $table->foreignId('ingredient_id')->constrained()->cascadeOnDelete(); // Ссылка на ингредиент
            $table->unsignedInteger('quantity')->default(0); // Количество, не может быть отрицательным, по умолчанию 0
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fridge_ingredient');
    }
};
