<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Guest extends Model
{
    protected $fillable = [
        'full_name',
        'email',
        'phone',
        'id_number',
        'address',
        'date_of_birth',
        'gender',
        'nationality',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
    ];

    /**
     * Get all bookings for this guest
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
