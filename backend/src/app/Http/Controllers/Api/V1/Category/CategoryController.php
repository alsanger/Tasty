<?php

namespace App\Http\Controllers\Api\V1\Category;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Category\StoreCategoryRequest;
use App\Http\Requests\Api\V1\Category\UpdateCategoryRequest;
use App\Http\Resources\Api\V1\Category\CategoryCollection;
use App\Http\Resources\Api\V1\Category\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function index(): CategoryCollection
    {
        $categories = Category::query()->paginate(100);
        return new CategoryCollection($categories);
    }

    public function store(StoreCategoryRequest $request): CategoryResource
    {
        $this->authorize('create', Category::class);

        $category = Category::create($request->validated());
        return new CategoryResource($category);
    }

    public function show(Category $category): CategoryResource
    {
        return new CategoryResource($category);
    }

    public function update(UpdateCategoryRequest $request, Category $category): CategoryResource
    {
        $this->authorize('update', Category::class);

        $category->update($request->validated());
        return new CategoryResource($category);
    }

    public function destroy(Category $category): JsonResponse
    {
        $this->authorize('delete', Category::class);

        $category->delete();
        // Возвращаем сообщение
        return response()->json(['message' => 'Категорія була успішно видалена'], 200);
    }
}

