<?php

namespace App\Http\Controllers\Api\V1\Image;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Image\ImageUploadRequest;
use App\Models\Recipe;
use App\Models\RecipeStep;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageUploadController extends Controller
{
    public function upload(ImageUploadRequest $request)
    {
        $extension = $request->file('image')->getClientOriginalExtension();
        $id = $request->id;
        $recipeStepId = $request->recipe_step_id;

        // Формируем путь к файлу
        switch ($request->type) {
            case 'avatar':
            case 'avatars':
                $filename = "{$id}.{$extension}";
                $path = "avatars/{$filename}";
                // Обновляем URL в базе данных
                $user = User::find($id);
                if ($user) {
                    $user->avatar_url = asset("storage/$path");
                    $user->save();
                }
                break;

            case 'recipe':
            case 'recipes':
                if ($recipeStepId) {
                    $filename = "{$recipeStepId}.{$extension}";
                    $path = "recipes/{$id}/steps/{$filename}";
                    // Обновляем URL в базе данных
                    $recipeStep = RecipeStep::find($recipeStepId);
                    if ($recipeStep) {
                        $recipeStep->image_url = asset("storage/$path");
                        $recipeStep->save();
                    }
                } else {
                    $filename = "main.{$extension}";
                    $path = "recipes/{$id}/{$filename}";
                    // Обновляем URL в базе данных
                    $recipe = Recipe::find($id);
                    if ($recipe) {
                        $recipe->image_url = asset("storage/$path");
                        $recipe->save();
                    }
                }
                break;

            default:
                return response()->json(['error' => 'Invalid type'], 400);
        }

        // Создаем директорию, если она не существует
        $directory = dirname($path);
        if (!Storage::disk('public')->exists($directory)) {
            Storage::disk('public')->makeDirectory($directory);
        }

        // Удаляем старый файл, если он существует
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }

        // Сохраняем новый файл
        Storage::disk('public')->put($path, file_get_contents($request->file('image')));

        return response()->json(['image_url' => asset("storage/$path")]);
    }

    public function getImages(Request $request)
    {
        $id = $request->id;
        $recipeStepId = $request->recipe_step_id;

        switch ($request->type) {
            case 'avatar':
            case 'avatars':
                $pattern = "avatars/{$id}.*";
                break;

            case 'recipe':
            case 'recipes':
                if ($recipeStepId) {
                    $pattern = "recipes/{$id}/steps/{$recipeStepId}.*";
                } else {
                    $pattern = "recipes/{$id}/main.*";
                }
                break;

            default:
                return response()->json(['error' => 'Invalid type'], 400);
        }

        $baseDir = dirname($pattern);

        // Создаем директорию, если она не существует
        if (!Storage::disk('public')->exists($baseDir)) {
            Storage::disk('public')->makeDirectory($baseDir);
            return response()->json(['images' => []]);
        }

        $files = Storage::disk('public')->files($baseDir);
        $filteredFiles = array_filter($files, fn ($file) => fnmatch($pattern, $file));
        $imageUrls = array_map(fn ($file) => asset("storage/$file"), $filteredFiles);

        return response()->json(['images' => $imageUrls]);
    }

    public function delete(Request $request)
    {
        $imagePath = $request->image_path;
        $relativePath = str_replace(asset('storage') . '/', '', $imagePath);

        if (Storage::disk('public')->exists($relativePath)) {
            // Определяем тип и ID для обновления базы данных
            $pathParts = explode('/', $relativePath);

            if (count($pathParts) > 0) {
                $type = $pathParts[0];

                if ($type === 'avatars' && isset($pathParts[1])) {
                    $userId = (int) explode('.', $pathParts[1])[0];
                    $user = User::find($userId);
                    if ($user && $user->avatar_url === $imagePath) {
                        $user->avatar_url = null;
                        $user->save();
                    }
                }
                else if ($type === 'recipes') {
                    if (count($pathParts) >= 3 && $pathParts[2] === 'main.jpg') {
                        $recipeId = (int) $pathParts[1];
                        $recipe = Recipe::find($recipeId);
                        if ($recipe && $recipe->image_url === $imagePath) {
                            $recipe->image_url = null;
                            $recipe->save();
                        }
                    }
                    else if (count($pathParts) >= 4 && $pathParts[2] === 'steps') {
                        $stepId = (int) explode('.', $pathParts[3])[0];
                        $recipeStep = RecipeStep::find($stepId);
                        if ($recipeStep && $recipeStep->image_url === $imagePath) {
                            $recipeStep->image_url = null;
                            $recipeStep->save();
                        }
                    }
                }
            }

            // Удаляем файл
            Storage::disk('public')->delete($relativePath);
            return response()->json(['message' => 'Изображение удалено']);
        }

        return response()->json(['error' => 'Файл не найден'], 404);
    }
}
