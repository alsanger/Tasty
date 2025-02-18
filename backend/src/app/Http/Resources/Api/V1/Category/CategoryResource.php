<?php

namespace App\Http\Resources\Api\V1\Category;

use App\Decorators\CategoryDecorator;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return (new CategoryDecorator($this->resource instanceof Category ? $this->resource : $this->resource->resource))->toArray();
    }
}
