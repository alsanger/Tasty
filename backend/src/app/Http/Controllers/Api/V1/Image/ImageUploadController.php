<?php

namespace App\Http\Controllers\Api\V1\Image;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Image\ImageUploadRequest;
use App\Models\Category;
use App\Models\Recipe;
use App\Models\RecipeStep;
use App\Models\User;

use App\Services\ImageUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ImageUploadController extends Controller
{
    protected $imageUploadService;

    public function __construct(ImageUploadService $imageUploadService)
    {
        $this->imageUploadService = $imageUploadService;
    }

    // Загрузка аватара пользователя
    /*public function uploadUserAvatar(ImageUploadRequest $request): JsonResponse
    {
        $file = $request->file('image');
        if (!$file) {
            Log::error('Файл не найден в запросе');
            return response()->json(['error' => 'Файл не найден'], 400);
        }

        $userId = $request->input('id');

        // Проверка прав доступа: пользователь может загружать только свой аватар
        if (Auth::id() != $userId) {
            return response()->json(['error' => 'Доступ запрещен'], 403);
        }

        $imageUrl = $this->imageUploadService->uploadUserAvatar($file, $userId);

        if (!$imageUrl) {
            return response()->json(['error' => 'Ошибка при загрузке изображения'], 500);
        }

        // Обновление модели пользователя
        $user = User::find($userId);
        if ($user) {
            $user->avatar_url = $imageUrl;
            $user->save();
        }

        return response()->json(['image_url' => $imageUrl]);
    }*/
    public function uploadUserAvatar(ImageUploadRequest $request): JsonResponse
    {
        Log::info('Начало загрузки аватара пользователя.');

        $file = $request->file('image');
        if (!$file) {
            Log::error('Файл не найден в запросе.');
            return response()->json(['error' => 'Файл не найден'], 400);
        }
        Log::info('Файл успешно получен из запроса.');

        $userId = $request->input('id');
        Log::info('ID пользователя из запроса: ' . $userId);

        // Получаем пользователя из токена в заголовке
        $user = Auth::user();
        if (!$user) {
            Log::error('Пользователь не аутентифицирован. Токен отсутствует или недействителен.');
            return response()->json(['error' => 'Доступ запрещен'], 403);
        }
        Log::info('Текущий аутентифицированный пользователь: ' . $user->id);

        // Проверка прав доступа: пользователь может загружать только свой аватар
        if ($user->id != $userId) {
            Log::error('Попытка загрузить аватар для другого пользователя. Текущий пользователь: ' . $user->id . ', запрошенный пользователь: ' . $userId);
            return response()->json(['error' => 'Доступ запрещен'], 403);
        }
        Log::info('Проверка прав доступа успешно пройдена.');

        // Загрузка аватара
        Log::info('Начало загрузки аватара в сервис.');
        $imageUrl = $this->imageUploadService->uploadUserAvatar($file, $userId);
        if (!$imageUrl) {
            Log::error('Ошибка при загрузке изображения в сервис.');
            return response()->json(['error' => 'Ошибка при загрузке изображения'], 500);
        }
        Log::info('Аватар успешно загружен. URL: ' . $imageUrl);

        // Обновление модели пользователя
        Log::info('Начало обновления модели пользователя.');
        $user->avatar_url = "/storage/$imageUrl";
        $user->save();
        Log::info('Модель пользователя успешно обновлена.');

        Log::info('Загрузка аватара завершена успешно.');
        return response()->json(['image_url' => $imageUrl]);
    }

    // Загрузка изображения категории
    public function uploadCategoryImage(ImageUploadRequest $request): JsonResponse
    {
        $file = $request->file('image');
        if (!$file) {
            Log::error('Файл не найден в запросе');
            return response()->json(['error' => 'Файл не найден'], 400);
        }

        $categoryId = $request->input('id');

        // Проверку прав доступа к категории, если необходимо

        $imageUrl = $this->imageUploadService->uploadCategoryImage($file, $categoryId);

        if (!$imageUrl) {
            return response()->json(['error' => 'Ошибка при загрузке изображения'], 500);
        }

        // Обновление модели категории
        $category = Category::find($categoryId);
        if ($category) {
            $category->image_url = "/storage/$imageUrl";
            $category->save();
        }

        return response()->json(['image_url' => $imageUrl]);
    }

    // Загрузка основного изображения рецепта
    public function uploadRecipeImage(ImageUploadRequest $request): JsonResponse
    {
        $file = $request->file('image');
        if (!$file) {
            Log::error('Файл не найден в запросе');
            return response()->json(['error' => 'Файл не найден'], 400);
        }

        $recipeId = $request->input('id');

        // Проверка прав доступа: только владелец рецепта может загружать изображения
        $recipe = Recipe::find($recipeId);
        if (!$recipe || $recipe->user_id != Auth::id()) {
            return response()->json(['error' => 'Доступ запрещен'], 403);
        }

        $imageUrl = $this->imageUploadService->uploadRecipeImage($file, $recipeId);

        if (!$imageUrl) {
            return response()->json(['error' => 'Ошибка при загрузке изображения'], 500);
        }

        // Обновление модели рецепта
        $recipe->image_url = "/storage/$imageUrl";
        $recipe->save();

        return response()->json(['image_url' => $imageUrl]);
    }

    // Загрузка изображения шага рецепта
    public function uploadRecipeStepImage(ImageUploadRequest $request): JsonResponse
    {
        $file = $request->file('image');
        if (!$file) {
            Log::error('Файл не найден в запросе');
            return response()->json(['error' => 'Файл не найден'], 400);
        }

        $recipeId = $request->input('id');
        $stepId = $request->input('recipe_step_id');

        if (!$stepId) {
            return response()->json(['error' => 'ID шага рецепта не указан'], 400);
        }

        // Проверка прав доступа через рецепт: только владелец рецепта может загружать изображения
        $recipe = Recipe::find($recipeId);
        if (!$recipe || $recipe->user_id != Auth::id()) {
            return response()->json(['error' => 'Доступ запрещен'], 403);
        }

        // Дополнительная проверка, что шаг действительно принадлежит этому рецепту
        $recipeStep = RecipeStep::find($stepId);
        if (!$recipeStep || $recipeStep->recipe_id != $recipeId) {
            return response()->json(['error' => 'Шаг не найден или не принадлежит указанному рецепту'], 400);
        }

        $imageUrl = $this->imageUploadService->uploadRecipeStepImage($file, $recipeId, $stepId);

        if (!$imageUrl) {
            return response()->json(['error' => 'Ошибка при загрузке изображения'], 500);
        }

        // Обновление модели шага рецепта
        $recipeStep->image_url = "/storage/$imageUrl";
        $recipeStep->save();

        return response()->json(['image_url' => $imageUrl]);
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
