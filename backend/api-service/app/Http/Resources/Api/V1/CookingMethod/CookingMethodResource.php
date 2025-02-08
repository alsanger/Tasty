<?php

namespace App\Http\Resources\Api\V1\CookingMethod;

use App\Decorators\CookingMethodDecorator;
use App\Models\CookingMethod;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CookingMethodResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return (new CookingMethodDecorator($this->resource instanceof CookingMethod ? $this->resource : $this->resource->resource))->toArray();
    }
}
