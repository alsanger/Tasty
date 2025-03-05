<?php

namespace App\Http\Controllers\Api\V1\Image;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Image\ImageUploadRequest;
use App\Models\Category;
use App\Models\Recipe;
use App\Models\RecipeStep;
use App\Models\User;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ImageUploadController extends Controller
{
    public function upload(ImageUploadRequest $request): JsonResponse
    {
        Log::info('Заголовки запроса:', $request->headers->all());
        Log::info('Тип контента:', [$request->header('Content-Type')]);
        Log::info('Данные запроса:', $request->all());

        $file = $request->file('image');

        if (!$file) {
            Log::error('Файл не найден в запросе');
            return response()->json(['error' => 'Файл не найден'], 400);
        }

        $type = $request->input('type');
        $id = $request->input('id');
        $recipeStepId = $request->input('recipe_step_id');

        $extension = $file->getClientOriginalExtension();

        switch ($type) {
            case 'avatar':
            case 'avatars':
                $filename = "{$id}.{$extension}";
                $path = "avatars/{$filename}";
                $user = User::find($id);
                if ($user) {
                    $user->avatar_url = asset("storage/$path");
                    $user->save();
                }
                break;

            case 'category':
            case 'categories':
                $filename = "{$id}.{$extension}";
                $path = "categories/{$filename}";
                $category = Category::find($id);
                if ($category) {
                    $category->image_url = asset("storage/$path");
                    $category->save();
                }
                break;

            case 'recipe':
            case 'recipes':
                if ($recipeStepId) {
                    $filename = "{$recipeStepId}.{$extension}";
                    $path = "recipes/{$id}/steps/{$filename}";
                    $recipeStep = RecipeStep::find($recipeStepId);
                    if ($recipeStep) {
                        $recipeStep->image_url = asset("storage/$path");
                        $recipeStep->save();
                    }
                } else {
                    $filename = "main.{$extension}";
                    $path = "recipes/{$id}/{$filename}";
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
        $file->storeAs('public', $path);

        return response()->json(['image_url' => asset("storage/$path")]);
    }

    public function getImage(Request $request)
    {
        $imageUrl = $request->input('url');

        try {
            // Извлекаем путь из полного URL
            $path = parse_url($imageUrl, PHP_URL_PATH);
            $path = str_replace('/storage/', '', $path);

            $fullPath = storage_path('app/public/' . $path);

            Log::info("Полный путь: {$fullPath}");

            if (!file_exists($fullPath)) {
                Log::warning("Файл не найден: {$path}");
                return response()->file(public_path('default-image.png'));
            }

            Log::info("Успешная загрузка файла: {$path}");
            return response()->file($fullPath);
        } catch (\Exception $e) {
            Log::error("Ошибка при загрузке файла: " . $e->getMessage());
            return response()->file(public_path('default-image.png'));
        }
    }

    public function delete(Request $request): JsonResponse
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
                else if ($type === 'categories' && isset($pathParts[1])) {
                    $categoryId = (int) explode('.', $pathParts[1])[0];
                    $category = Category::find($categoryId);
                    if ($category && $category->image_url === $imagePath) {
                        $category->image_url = null;
                        $category->save();
                    }
                }
                else if ($type === 'recipes') {
                    if (isset($pathParts[2]) && $pathParts[2] === 'main.jpg' || (isset($pathParts[2]) && strpos($pathParts[2], 'main.') === 0)) {
                        $recipeId = (int) $pathParts[1];
                        $recipe = Recipe::find($recipeId);
                        if ($recipe && $recipe->image_url === $imagePath) {
                            $recipe->image_url = null;
                            $recipe->save();
                        }
                    }
                    else if (isset($pathParts[2]) && $pathParts[2] === 'steps' && isset($pathParts[3])) {
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
