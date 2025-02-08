<?php

namespace App\Http\Resources\Api\V1\Role;

use App\Decorators\RoleDecorator;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request $request
     * @return array
     */
    public function toArray(Request $request)
    {
        return (new RoleDecorator($this->resource instanceof Role ? $this->resource : $this->resource->resource))->toArray();
    }
}
