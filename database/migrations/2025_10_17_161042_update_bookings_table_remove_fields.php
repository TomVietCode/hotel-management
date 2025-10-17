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
        Schema::table('bookings', function (Blueprint $table) {
            // Remove specified fields
            $table->dropColumn(['adults', 'children', 'paid_amount', 'special_requests']);
            
            // Update status enum to only allow the required values
            $table->dropColumn('status');
        });
        
        // Add the new status column with updated enum values
        Schema::table('bookings', function (Blueprint $table) {
            $table->enum('status', ['confirmed', 'checked_in', 'checked_out', 'late_checkout'])->default('confirmed');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            // Add back the removed fields
            $table->integer('adults')->default(1);
            $table->integer('children')->default(0);
            $table->decimal('paid_amount', 10, 2)->default(0);
            $table->text('special_requests')->nullable();
            
            // Restore original status enum
            $table->dropColumn('status');
        });
        
        Schema::table('bookings', function (Blueprint $table) {
            $table->enum('status', ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show'])->default('pending');
        });
    }
};