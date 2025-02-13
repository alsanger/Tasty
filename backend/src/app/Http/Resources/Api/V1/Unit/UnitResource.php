<?php

namespace App\Http\Resources\Api\V1\Unit;

use App\Decorators\UnitDecorator;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UnitResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return (new UnitDecorator($this->resource instanceof Unit ? $this->resource : $this->resource->resource))->toArray();
    }
}
