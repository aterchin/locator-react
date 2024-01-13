<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Business;
use App\Models\Location;

class BusinessSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $file = base_path('database/csv/business_data.csv');
        if (!file_exists($file)) {
            die("The file `database/csv/business_data.csv` was not found.\n\n");
        }

        // remove all the old entries
        Business::truncate();

        $csv = fopen($file, 'r');
        $row = true;
        while (($data = fgetcsv($csv, 555, ',')) !== false) {
            if (!$row) {
                if ($data['0'] === NULL) {
                    // end of file most likely but a man needs a name
                    continue;
                }

                printf("\n");

                $name       = $data['0']; // name of business
                $city       = $data['1']; // city
                $postal     = $data['2']; // postal code
                $street     = $data['3']; // street address
                $state      = $data['4']; // state

                // location base array for hash ID
                $l_arr = [$street, $city, $state, $postal];
                $l_hex = md5(implode('|', $l_arr));
                $l_bin = hex2bin($l_hex);

                // business base array for hash ID
                $p_arr = [$name] + $l_arr;
                $p_hex = md5(implode('|', $p_arr));
                $p_bin = hex2bin($p_hex);

                // Check for existing business before we try to get any location.
                // If they are not associated with a location, then they will not even be
                // in the businesses table.

                // Edge case: checking for a location in order to RE-add a business.  Possible
                // situations include business table gets truncated, or we prune outdated businesses
                // from time to time, yet locations still exist!  Why geocode again?

                // Note: comparison to hex in (vs binary) fixed mysql errors
                // when trying to do an equality check on an initially empty table.
                $business = DB::table('businesses')
                    ->whereRaw("HEX(`business_hash`) = ?", [$p_hex])
                    ->first();

                if ($business) {
                    // Name and address matches (nothing to see here, move along...)
                    printf("Existing business, skipping...\n");
                    continue;
                }

                printf("%s: querying locations...\n", $name);

                // Location ID is what creates a one to many relationship between
                // a specific geocoded location for one or more businesses.
                $location_id = DB::table('locations')
                    ->whereRaw("HEX(`location_hash`) = ?", [$l_hex])
                    ->value('id');

                if ($location_id) {
                    // Location matches; need to associate with new business entry.
                    printf("Existing location (id: %d). Associating with %s\n", $location_id, $name);
                } else {
                    // NOW do geocode.
                    printf("No location id found. Getting geocoded address...\n");
                    sleep(1);
                    $raw_address = implode(' ', $l_arr);
                    $collection = app('geocoder')->geocode($raw_address)->get();
                    $result = $collection->first();

                    /*
                    https://developers.google.com/maps/documentation/places/web-service/place-id

                    A place ID is a textual identifier that uniquely identifies a place. The length of the identifier may vary (there is no maximum length for Place IDs, so might not be a valid
                    option for storing in database unless we create a hash of it.

                    Retrieve place details using the place ID:
                    https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJrTLr-GyuEmsRBfy61i59si0&key=YOUR_API_KEY

                    Place IDs are exempt from the caching restrictions, you can also store place ID values for later use, but you will need to refresh them every 12 months.

                    //print_r($result->getId());
                    */

                    $address = $result->getFormattedAddress();
                    $coordinates = $result->getCoordinates();
                    $latitude = $coordinates->getLatitude();
                    $longitude = $coordinates->getLongitude();

                    // don't need these (leaving here for documentation purposes)
                    // $postal_code = $result->getPostalCode();
                    // $sub_locality = $result->getSubLocality();
                    // $locality = $result->getLocality();
                    // $street_number = $result->getStreetNumber();
                    // $street_name = $result->getStreetName();
                    // $state_code = $result->getAdminLevels()->get(1)->getCode();
                    // $state_name = $result->getAdminLevels()->get(1)->getName();
                    // $country_code = $result->getCountry()->getCode();                }

                    /*
                    HERE is a situation where two addresses
                    supplied in the imported file ARE SLIGHTLY DIFFERENT (i.e. small typo or misspelling)
                    but the geocode service finds the exact same address.  Ideally we do not want
                    two of the same locations in the database. So, another internal lookup to match address.  If found, we can add the foreign key to the business record.

                    This means one more database call but will save us a geocoding service API call moving forward. Additional scaling benefit is that we can now put a unique composite index on the lat/long cols for faster searches.

                    Note: The main reason I'm using address for this lookup is simplicity, in order
                    to avoid equality mistakes with rounded lat/long coordinates. Actual geocode results
                    may have more decimal places than what the database is storing.
                    */

                    $location_id = DB::table('locations')->where('address', $address)->value('id');
                    if ($location_id) {
                        // Address check success! Attach location id to new business entry!
                        printf("Existing location (id: %d, address: %s)\n", $location_id, $address);
                    } else {
                        // New location id...
                        $location = Location::create([
                            'location_hash' => $l_bin,
                            'address' => $address,
                            'latitude' => $latitude,
                            'longitude' => $longitude,
                        ]);
                        $location_id = $location->id;
                        printf("New location (id: %d, address: %s)\n", $location_id, $address);
                    }
                }

                // Location id should definitely be available to attach to the new business now.
                Business::create([
                    'business_hash' => $p_bin,
                    'location_id' => $location_id,
                    'name' => $name,
                    'street' => $street,
                    'city' => $city,
                    'state' => $state,
                    'postal' => $postal,
                ]);

                // Here's a method for insert/ignore but unnecesary (unique business_hash col)

                // Incidentally, timestamps are only added automatically with the Model::create method
                // so when using the Query Builder, you should add them or they are set to NULL on insert.

                // $now = DB::raw('CURRENT_TIMESTAMP');
                // DB::table('businesses')->insertOrIgnore([
                //     'business_hash' => $p_bin,
                //     'location_id' => $location_id,
                //     'name' => $name,
                //     'street' => $street,
                //     'city' => $city,
                //     'state' => $state,
                //     'postal' => $postal,
                //     'updated_at' => $now,
                //     'created_at' => $now,
                // ]);
            }
            $row = false;
        }
        // end of line
        fclose($csv);
    }
}
