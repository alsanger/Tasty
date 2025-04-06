<?php

namespace App\Http\Controllers\Api\V1\Country;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Country\StoreCountryRequest;
use App\Http\Requests\Api\V1\Country\UpdateCountryRequest;
use App\Http\Resources\Api\V1\Country\CountryCollection;
use App\Http\Resources\Api\V1\Country\CountryResource;
use App\Models\Country;
use Illuminate\Http\JsonResponse;

class CountryController extends Controller
{
    public function index(): CountryCollection
    {
        $countries = Country::query()->orderBy('name')->paginate(100);
        return new CountryCollection($countries);
    }

    public function store(StoreCountryRequest $request): CountryResource
    {
        $this->authorize('create', Country::class);

        $country = Country::create($request->validated());
        return new CountryResource($country);
    }

    public function show(Country $country): CountryResource
    {
        return new CountryResource($country);
    }

    public function update(UpdateCountryRequest $request, Country $country): CountryResource
    {
        $this->authorize('update', Country::class);

        $country->update($request->validated());
        return new CountryResource($country);
    }

    public function destroy(Country $country): JsonResponse
    {
        $this->authorize('delete', Country::class);

        $country->delete();
        // Возвращаем сообщение
        return response()->json(['message' => 'Країна була успішно видалена'], 200);
    }
}
