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

    

    public function rooms()
    {
        return $this->hasMany(Room::class);
    }
}
