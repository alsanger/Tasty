<?php

namespace App\Http\Requests\Api\V1\User;

use Illuminate\Foundation\Http\FormRequest;

class FollowRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $user = auth()->user();

        $rules = [
            'follower_id' => ['required', 'exists:users,id'],
            'following_id' => ['required', 'exists:users,id'],
        ];

        // Добавляем ограничение только для обычных пользователей
        if (!$user->hasRole('admin')) {
            $rules['following_id'][] = 'not_in:' . auth()->id();
        }

        return $rules;
    }

    /* public function messages()
     {
         return [
             'user.not_in' => 'Ви не маєте можливість підписатися на самого себе',
         ];
     }*/
}
