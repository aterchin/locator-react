<?php

namespace App\Helpers;

class LocationHelper
{
    public static function helloWorld()
    {
        return "Hello World";
    }

    public static function boundingBox($latitude, $longitude, $distance)
    {
        $latLimits = [deg2rad(-90), deg2rad(90)];
        $lonLimits = [deg2rad(-180), deg2rad(180)];

        $radLat = deg2rad($latitude);
        $radLon = deg2rad($longitude);

        if (
            $radLat < $latLimits[0] || $radLat > $latLimits[1]
            || $radLon < $lonLimits[0] || $radLon > $lonLimits[1]
        ) {
            throw new \Exception("Invalid Argument");
        }

        // Angular distance in radians on a great circle,
        // using Earth's radius in miles.
        $angular = $distance / 3958.762079;

        $minLat = $radLat - $angular;
        $maxLat = $radLat + $angular;

        if ($minLat > $latLimits[0] && $maxLat < $latLimits[1]) {
            $deltaLon = asin(sin($angular) / cos($radLat));
            $minLon = $radLon - $deltaLon;

            if ($minLon < $lonLimits[0]) {
                $minLon += 2 * pi();
            }

            $maxLon = $radLon + $deltaLon;

            if ($maxLon > $lonLimits[1]) {
                $maxLon -= 2 * pi();
            }
        } else {
            // A pole is contained within the distance.
            $minLat = max($minLat, $latLimits[0]);
            $maxLat = min($maxLat, $latLimits[1]);
            $minLon = $lonLimits[0];
            $maxLon = $lonLimits[1];
        }

        return [
            'minLat' => rad2deg($minLat),
            'minLon' => rad2deg($minLon),
            'maxLat' => rad2deg($maxLat),
            'maxLon' => rad2deg($maxLon),
        ];
    }

    public function scopeWithinMilesOf($query, $latitude, $longitude, $miles)
    {
        $box = static::boundingBox($latitude, $longitude, $miles);

        $query
            // Latitude part of the bounding box.
            ->whereBetween('latitude', [
                $box['minLat'],
                $box['maxLat']
            ])
            // Longitude part of the bounding box.
            ->whereBetween('longitude', [
                $box['minLon'],
                $box['maxLon']
            ])
            // Accurate calculation that eliminates false positives.
            ->whereRaw('(ST_Distance_Sphere(point(longitude, latitude), point(?,?))) <= ?', [
                $longitude,
                $latitude,
                $miles / 0.000621371192
            ]);
    }
}
