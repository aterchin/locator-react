<?php

namespace App\Http\Controllers;

use App\Helpers\LocationHelper;
use App\Models\Business;
use App\Http\Resources\BusinessResource;
use Illuminate\Http\Request;

class BusinessController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        // Defaulting to NYC within 10 miles
        $lat = 40.7639;
        $lng = -73.9794;
        $distance = 10;
        $place = '';

        if ($request->has('distance')) {
            $distance = $request->distance;
        }

        if ($request->has('place')) {
            $place = $request->place;
        }

        if ($request->has('coordinates.lat') && $request->has('coordinates.lng')) {
            $coordinates = $request->coordinates;
            extract($coordinates);
        }


        return BusinessResource::collection(
            Business::whereHas('location', function ($query) use ($lat, $lng, $distance) {
                $helper = new LocationHelper();
                $helper->scopeWithinMilesOf($query, $lat, $lng, $distance);
            })
                ->limit(120)
                ->paginate(40)
                ->appends(request()->query())
        )->additional([
            // send request back to update
            'search' => [
                'coordinates' => ['lat' => floatval($lat), 'lng' => floatval($lng)],
                'distance' => intval($distance),
                'place' => $place
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Business $business)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Business $business)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Business $business)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Business $business)
    {
        //
    }
}
