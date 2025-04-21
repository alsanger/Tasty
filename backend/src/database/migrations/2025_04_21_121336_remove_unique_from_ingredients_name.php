<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ingredients', function (Blueprint $table) {
            // Удаляем только уникальный индекс, оставляя столбец без изменений
            $table->dropUnique(['name']);
        });
    }

    public function down(): void
    {
        Schema::table('ingredients', function (Blueprint $table) {
            // Восстанавливаем уникальность (если потребуется откат)
            $table->unique('name');
        });
    }
};
