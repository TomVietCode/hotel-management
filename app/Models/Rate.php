<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rate extends Model
{
    protected $fillable = [
        'room_type',
        'price',
        'cancellation_policy',
        'total_rooms',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function rooms()
    {
        return $this->hasMany(Room::class);
    }
}
