<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\User\StoreUserRequest;
use App\Http\Requests\Api\V1\User\UpdateUserRequest;
use App\Http\Resources\Api\V1\Role\RoleResource;
use App\Http\Resources\Api\V1\User\UserCollection;
use App\Http\Resources\Api\V1\User\UserResource;
use App\Jobs\SendWelcomeEmailJob;
use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    // Метод index с КЕШИРОВАНИЕМ ДАННЫХ
    /*public function index()
    {
        $this->authorize('viewAny', User::class);

        $users = Cache::remember('users_index', 60, function () {
            return User::with(['roles'])->paginate(20); // Жадная загрузка ролей
        });

        return new UserCollection($users); // Возвращаем коллекцию пользователей
    }*/
    public function index(): UserCollection
    {
        $users = User::with(['roles'])->paginate(20); // Жадная загрузка ролей

        return new UserCollection($users); // Возвращаем коллекцию пользователей
    }

    public function store(StoreUserRequest $request): UserResource
    {
        $user = User::create($request->validated());

        // Если в запросе переданы роли, связываем их
        if ($request->has('roles')) {
            $user->roles()->sync($request->input('roles'));
        }
        else if (User::count() === 1) {
            // Убедимся, что роль "admin" существует
            $adminRole = Role::firstOrCreate(
                ['name' => 'admin'], // Условие поиска
                ['description' => 'Administrator'] // Данные для создания, если не найдено
            );
            // Присваиваем роль "admin" первому зарегистрированному пользователю (чтобы в базе был хоть один администратор)
            $user->roles()->attach($adminRole->id);
        }
        else {
            $userRole = Role::firstOrCreate(
                ['name' => 'user'],
                ['description' => 'User']
            );
            // Присваиваем роль "user" по умолчанию
            $user->roles()->attach($userRole->id);
        }

        // Запускаем событие регистрации (для отправки письма с верификацией)
        event(new Registered($user));
        //dispatch(new SendWelcomeEmailJob($user));

        // Создаем токен для пользователя
        $tokenName = $user->email . " API Token";
        $user->token = $user->createToken($tokenName)->plainTextToken;

        return new UserResource($user->load('roles')); // Используем UserResource для возвращения созданного пользователя с ролями
    }

    // МЕТОД show с КЕШИРОВАНИЕМ ДАННЫХ

    /*public function show(User $user)
    {
        //$this->authorize('view', $user);

        $user = Cache::remember("user_{$user->id}", 60, function () use ($user) {
            return $user->load('roles');
        });

        return new UserResource($user); // Возвращаем декоратор через UserResource
    }*/
    public function show(User $user): UserResource
    {
        return new UserResource($user->load('roles', 'followers', 'following')); // Возвращаем декоратор через UserResource
    }

    public function update(UpdateUserRequest $request, User $user): UserResource
    {
        $this->authorize('update', $user);

        $user->update($request->validated());

        // Если в запросе переданы роли, обновляем связи
        if ($request->has('roles')) {
            $this->authorize('updateRoles', $user);
            $user->roles()->sync($request->input('roles'));
        }

        return new UserResource($user->load('roles')); // Возвращаем обновленного пользователя с ролями
    }

    public function destroy(User $user): JsonResponse
    {
        $this->authorize('delete', $user);

        $user->roles()->detach(); // Разрываем связи с ролями
        $user->delete();

        return response()->json(['message' => 'Користувач був успішно видалений'], 200); // Возвращаем сообщение
    }

    public function roles(User $user)
    {
        $this->authorize('viewRoles', User::class);

        return response()->json([
            'data' => RoleResource::collection($user->roles),
        ]);
    }
}
