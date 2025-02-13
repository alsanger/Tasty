<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ingredient_recipe', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recipe_id')->constrained()->cascadeOnDelete(); // Внешний ключ на таблицу recipes
            $table->foreignId('ingredient_id')->constrained()->cascadeOnDelete(); // Внешний ключ на таблицу ingredients
            $table->decimal('quantity', 8, 2)->unsigned(); // Количество ингредиента в рецепте
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ingredient_recipe');
    }
};
