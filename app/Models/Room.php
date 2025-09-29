<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = [
        'room_number',
        'bed_type',
        'floor',
        'facilities',
        'status',
        'rate_id'
    ];

    protected $casts = [
        'bed_type' => 'string',
        'status' => 'string'
    ];

    public function rate()
    {
        return $this->belongsTo(Rate::class);
    }
}
