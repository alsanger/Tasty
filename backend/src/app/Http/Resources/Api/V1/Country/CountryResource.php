<?php

namespace App\Http\Resources\Api\V1\Country;

use App\Decorators\CountryDecorator;
use App\Models\Country;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CountryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return (new CountryDecorator($this->resource instanceof Country ? $this->resource : $this->resource->resource))->toArray();
    }
}
