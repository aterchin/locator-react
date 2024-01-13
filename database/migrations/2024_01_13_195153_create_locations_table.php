<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('address');
            $table->decimal('latitude', 8, 6);
            $table->decimal('longitude', 9, 6);
            $table->index(['latitude', 'longitude']);
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
            $table->comment('Geocoded location data.');
        });

        DB::statement("ALTER TABLE locations ADD `location_hash` BINARY(16) NOT NULL UNIQUE KEY AFTER `id`");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};
