<?php

namespace App\Observers;

use App\Models\CookingPlan;
use App\Models\User;
use App\Models\Fridge;

class UserObserver
{
    public function created(User $user): void
    {
        Fridge::create([
            'user_id' => $user->id,
        ]);

        CookingPlan::create([
            'user_id' => $user->id,
        ]);
    }

    public function updated(User $user): void
    {
        //
    }

    public function deleted(User $user): void
    {
        //
    }

    public function restored(User $user): void
    {
        //
    }

    public function forceDeleted(User $user): void
    {
        //
    }
}
