<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recipe_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recipe_id')->constrained()->cascadeOnDelete();
            $table->integer('step_number');
            $table->text('description');
            $table->string('image_url')->nullable();
            $table->timestamps();

            // Добавляем составной уникальный ключ
            $table->unique(['recipe_id', 'step_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recipe_steps');
    }
};
