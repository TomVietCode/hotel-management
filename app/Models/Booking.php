<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Booking extends Model
{
    protected $fillable = [
        'booking_code',
        'guest_id',
        'room_id',
        'check_in_date',
        'check_out_date',
        'actual_check_in',
        'actual_check_out',
        'status',
        'adults',
        'children',
        'total_amount',
        'paid_amount',
        'special_requests',
        'notes',
    ];

    protected $casts = [
        'check_in_date' => 'date',
        'check_out_date' => 'date',
        'actual_check_in' => 'datetime',
        'actual_check_out' => 'datetime',
        'total_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
    ];

    /**
     * Get the guest that owns the booking
     */
    public function guest(): BelongsTo
    {
        return $this->belongsTo(Guest::class);
    }

    /**
     * Get the room that belongs to the booking
     */
    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    /**
     * Get the number of nights for this booking
     */
    public function getNightsAttribute(): int
    {
        return $this->check_in_date->diffInDays($this->check_out_date);
    }

    /**
     * Check if booking is active (checked in but not checked out)
     */
    public function isActive(): bool
    {
        return $this->status === 'checked_in';
    }

    /**
     * Check if booking is due for check-in today
     */
    public function isDueIn(): bool
    {
        return $this->check_in_date->isToday() && in_array($this->status, ['confirmed', 'pending']);
    }

    /**
     * Check if booking is due for check-out today
     */
    public function isDueOut(): bool
    {
        return $this->check_out_date->isToday() && $this->status === 'checked_in';
    }
}
