### Locator - React
This is an address locator app built with Laravel 10 on backend, and using the Inertia/Vite starter kit with React on the frontend.

## Installation

### Requirements

PHP >= 8.1 (8.2 preferred)
Node >= 16

If your server is running PHP 8.1, you may need to add `--ignore-platform-reqs` to the Composer installation.

```
composer install
```

Create a new database. Copy the `.env.example` to `.env`, enter database values (DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD) and anything else relevant. *You might have to change DB_HOST from `127.0.0.1` to `localhost` depending on your setup, as I did (MAMP).*

Generate a new app key if needed:

```
php artisan key:generate
```

Run the database migration.

```
php artisan migrate
```

Either use your preferred local server URL (added to `.env` file) or start the artisan server:

```
php artisan serve
```

OR use your preferred local server (Apache, MAMP, XAMPP).

Get vite running.  In the same directory:

```
npm install
npm run dev
```

Done!

Tailwind CSS also installed, as well as Sass.  If you look inside `resources/app.jsx` you'll see the `..css/app.scss` imported at the top.

## Notes on setup

### Running the database import

When you are ready, the seeder will look for a file called `database/csv/business_data.csv`. Use the `database/csv/sample_report.csv` file to run testing.

```
php artisan db:seed --class=BusinessSeeder 
```

### Laravel

```
composer create-project laravel/laravel locator-react
cd locator-react
composer require laravel/breeze --dev
php artisan breeze:install react
```

## Links:

[GeocoderLaravel on Github](https://github.com/geocoder-php/GeocoderLaravel)
[Laravel: Get Latitude/Longitude from Address with Geocoder](https://laraveldaily.com/post/laravel-get-latitude-longitude-from-address-geocoder)
[Efficient Distance Querying in MySQL](https://aaronfrancis.com/2021/efficient-distance-querying-in-my-sql)
[Laravel 9 Import Records in SQL with CSV and Seeder](https://www.positronx.io/laravel-import-records-in-sql-with-csv-and-seeder-tutorial/)
