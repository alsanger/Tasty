<?php

namespace App\Http\Controllers\Api\V1\Recipe;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Recipe\StoreRecipeRequest;
use App\Http\Requests\Api\V1\Recipe\UpdateRecipeRequest;
use App\Http\Resources\Api\V1\Recipe\RecipeCollection;
use App\Http\Resources\Api\V1\Recipe\RecipeResource;
use App\Models\Recipe;
use App\Services\ImageUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class RecipeController extends Controller
{
    protected $imageUploadService;

    public function __construct(ImageUploadService $imageUploadService)
    {
        $this->imageUploadService = $imageUploadService;
    }
    public function index(): RecipeCollection
    {
        $recipes = Recipe::query()
            ->with([                     // Загрузка связанных данных
                'user',
                'category',
                'cookingMethod',
                'country',
                'ingredients',
                'ingredients.unit',
                'recipeSteps',
                'reviews.user',
                'likes.user'])
            ->paginate(30);
        return new RecipeCollection($recipes);
    }

    public function store(StoreRecipeRequest $request): RecipeResource
    {
        Log::info('Входящие данные:', $request->all());

        // Создаем новый рецепт с валидированными данными
        $validatedData = $request->validated();

        // Удаляем поле image из валидированных данных, так как это файл, а не строка
        if (isset($validatedData['image'])) {
            unset($validatedData['image']);
        }

        $recipe = Recipe::create($validatedData);

        // Обрабатываем основное изображение рецепта, если оно загружено
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $imageUrl = $this->imageUploadService->uploadRecipeImage($file, $recipe->id);

            if ($imageUrl) {
                $recipe->image_url = "/storage/$imageUrl";
                $recipe->save();
            }
        }

        // Привязываем ингредиенты, если они передаются
        if ($request->has('ingredients')) {
            foreach ($request->ingredients as $ingredientData) {
                $recipe->ingredients()->attach(
                    $ingredientData['ingredient_id'],
                    ['quantity' => $ingredientData['quantity']]
                );
            }
        }

        // Добавляем шаги приготовления, если они переданы
        if ($request->has('recipeSteps')) {
            foreach ($request->recipeSteps as $index => $stepData) {
                // Номер шага определяется порядком в массиве (+1, так как шаги обычно начинаются с 1)
                $stepNumber = $index + 1;

                // Сначала создаем шаг без изображения
                $recipeStep = $recipe->recipeSteps()->create([
                    'step_number' => $stepNumber,
                    'description' => $stepData['description'],
                    'image_url' => isset($stepData['image_url']) ? $stepData['image_url'] : null,
                ]);

                // Проверяем, содержит ли шаг изображение и это объект UploadedFile
                if (isset($stepData['image']) && $stepData['image'] instanceof \Illuminate\Http\UploadedFile) {
                    // Загружаем изображение через сервис
                    $uploadedImageUrl = $this->imageUploadService->uploadRecipeStepImage(
                        $stepData['image'],
                        $recipe->id,
                        $recipeStep->id
                    );

                    if ($uploadedImageUrl) {
                        // Обновляем URL изображения в шаге
                        $recipeStep->image_url = "/storage/$uploadedImageUrl";
                        $recipeStep->save();
                    }
                }
            }
        }

        // Загружаем связанные данные и возвращаем ресурс
        return new RecipeResource($recipe->load([
            'user',
            'category',
            'cookingMethod',
            'country',
            'ingredients',
            'ingredients.unit',
            'recipeSteps',
            'reviews.user',
            'likes.user']));
    }

    public function show(Recipe $recipe): RecipeResource
    {
        // Загружаем связанные данные для указанного рецепта
        return new RecipeResource($recipe->load([
            'user',
            'category',
            'cookingMethod',
            'country',
            'ingredients',
            'ingredients.unit',
            'recipeSteps',
            'reviews.user',
            'likes.user']));
    }

    public function update(UpdateRecipeRequest $request, Recipe $recipe): RecipeResource
    {
        // Авторизация
        $this->authorize('update', $recipe);

        // Обновляем рецепт с новыми данными
        $recipe->update($request->validated());

        // Обновление ингредиентов
        $recipe->ingredients()->sync(
            collect($request->ingredients)->mapWithKeys(function ($ingredient) {
                return [
                    $ingredient['ingredient_id'] => [
                        'quantity' => $ingredient['quantity']
                    ]
                ];
            })->toArray()
        );

        // Пересчитываем сложность рецепта
        //$recipe->update(['difficulty' => RecipeService::calculateDifficulty($recipe)]);

        // Загружаем связанные данные и возвращаем ресурс
        return new RecipeResource($recipe->load([
            'user',
            'category',
            'cookingMethod',
            'country',
            'ingredients',
            'ingredients.unit',
            'recipeSteps',
            'reviews.user',
            'likes.user']));
    }

    public function destroy(Recipe $recipe): JsonResponse
    {
        // Авторизация
        $this->authorize('delete', $recipe);

        // Удаляем рецепт
        $recipe->delete();

        // Возвращаем успешный ответ с сообщением
        return response()->json(['message' => 'Рецепт був успішно видалений'], 200);
    }
}
