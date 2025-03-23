<?php

namespace App\Providers;

use App\Models\Category;
use App\Models\CookingMethod;
use App\Models\CookingPlan;
use App\Models\Country;
use App\Models\Fridge;
use App\Models\Ingredient;
use App\Models\Like;
use App\Models\Recipe;
use App\Models\RecipeStep;
use App\Models\Review;
use App\Models\Unit;
use App\Models\User;
use App\Policies\CategoryPolicy;
use App\Policies\CookingMethodPolicy;
use App\Policies\CookingPlanPolicy;
use App\Policies\CountryPolicy;
use App\Policies\FridgePolicy;
use App\Policies\IngredientPolicy;
use App\Policies\LikePolicy;
use App\Policies\RecipePolicy;
use App\Policies\RecipeStepPolicy;
use App\Policies\ReviewPolicy;
use App\Policies\UnitPolicy;
use App\Policies\UserPolicy;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        Category::class => CategoryPolicy::class,
        CookingMethod::class => CookingMethodPolicy::class,
        CookingPlan::class => CookingPlanPolicy::class,
        Country::class => CountryPolicy::class,
        Fridge::class => FridgePolicy::class,
        Ingredient::class => IngredientPolicy::class,
        Like::class => LikePolicy::class,
        Recipe::class => RecipePolicy::class,
        RecipeStep::class => RecipeStepPolicy::class,
        Review::class => ReviewPolicy::class,
        Unit::class => UnitPolicy::class,
        User::class => UserPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();
    }
}
