<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rates', function (Blueprint $table) {
            $table->id();
            $table->string("room_type");
            $table->decimal("price", 10, 2);
            $table->enum("cancellation_policy", ["strict", "flexible", "non_refundable"]);
            $table->integer("total_rooms");
            $table->timestamps();
        });
        
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->integer("room_number")->unique();
            $table->enum("bed_type", ["single", "double", "triple"]);
            $table->integer("floor");
            $table->text("facilities")->nullable();
            $table->enum("status", ["available", "booked", "reserved", "blocked"])->default("available"); 
            $table->foreignId("rate_id")->constrained("rates")->onDelete("cascade");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rates');
    }
};
