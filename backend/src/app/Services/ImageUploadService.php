<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ImageUploadService
{
    /*public function saveImage(UploadedFile $file, string $path): ?string
    {
        try {
            $directory = dirname($path);

            if (!Storage::disk('public')->exists($directory)) {
                Storage::disk('public')->makeDirectory($directory);
            }

            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }

            $file->storeAs($path);

            return $path;
        } catch (\Exception $e) {
            Log::error('Ошибка при сохранении изображения: ' . $e->getMessage());
            return null;
        }
    }*/
    public function saveImage(UploadedFile $file, string $path): ?string
    {
        try {
            $directory = dirname($path);
            $filename = basename($path);
            $filenameWithoutExt = pathinfo($filename, PATHINFO_FILENAME);

            // Создаем директорию, если она не существует
            if (!Storage::disk('public')->exists($directory)) {
                Storage::disk('public')->makeDirectory($directory);
            }

            // Удаляем все существующие файлы с таким же именем, но возможно разными расширениями
            $existingFiles = Storage::disk('public')->files($directory);
            foreach ($existingFiles as $existingFile) {
                $existingFilename = basename($existingFile);
                $existingFilenameWithoutExt = pathinfo($existingFilename, PATHINFO_FILENAME);

                if ($existingFilenameWithoutExt === $filenameWithoutExt) {
                    Log::info("Удаляем существующий файл: {$existingFile}");
                    Storage::disk('public')->delete($existingFile);
                }
            }

            // Сохраняем новый файл
            //$file->storeAs('public/' . $directory, $filename);
            $file->storeAs($path);

            return $path;
        } catch (\Exception $e) {
            Log::error('Ошибка при сохранении изображения: ' . $e->getMessage());
            return null;
        }
    }

    public function uploadUserAvatar(UploadedFile $file, int $userId): ?string
    {
        $extension = $file->getClientOriginalExtension();
        $filename = "{$userId}.{$extension}";
        $path = "avatars/{$filename}";

        return $this->saveImage($file, $path);
    }

    public function uploadCategoryImage(UploadedFile $file, int $categoryId): ?string
    {
        $extension = $file->getClientOriginalExtension();
        $filename = "{$categoryId}.{$extension}";
        $path = "categories/{$filename}";

        return $this->saveImage($file, $path);
    }

    public function uploadRecipeImage(UploadedFile $file, int $recipeId): ?string
    {
        $extension = $file->getClientOriginalExtension();
        $filename = "main.{$extension}";
        $path = "recipes/{$recipeId}/{$filename}";

        return $this->saveImage($file, $path);
    }

    public function uploadRecipeStepImage(UploadedFile $file, int $recipeId, int $stepId): ?string
    {
        $extension = $file->getClientOriginalExtension();
        $filename = "{$stepId}.{$extension}";
        $path = "recipes/{$recipeId}/steps/{$filename}";

        return $this->saveImage($file, $path);
    }
}
