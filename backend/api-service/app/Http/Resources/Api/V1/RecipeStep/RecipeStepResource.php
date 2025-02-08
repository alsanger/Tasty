<?php

namespace App\Http\Resources\Api\V1\RecipeStep;

use App\Decorators\RecipeStepDecorator;
use App\Models\RecipeStep;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecipeStepResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return (new RecipeStepDecorator($this->resource instanceof RecipeStep ? $this->resource : $this->resource->resource))->toArray();
    }
}
