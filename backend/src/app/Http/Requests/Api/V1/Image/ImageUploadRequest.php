<?php

namespace App\Http\Requests\Api\V1\Image;

use Illuminate\Foundation\Http\FormRequest;

class ImageUploadRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'image' => ['required', 'file', 'mimes:jpg,jpeg,png,gif,webp,bmp,svg', 'max:5120'],
            'type' => ['required', 'string', 'in:avatar,recipe,recipe_step'],  // avatars | recipes | recipe_step
            'id' => ['required', 'integer'],
            'recipe_step_id' => ['nullable', 'integer'],
        ];
    }

    public function authorize()
    {
        return true;
    }
}
