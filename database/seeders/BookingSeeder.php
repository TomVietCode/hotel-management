<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Guest;
use App\Models\Booking;
use App\Models\Room;
use App\Models\Rate;
use Carbon\Carbon;

class BookingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Tạo rate mẫu nếu chưa có
        if (Rate::count() == 0) {
            $rates = [
                ['room_type' => 'Standard', 'price' => 500000, 'cancellation_policy' => 'flexible', 'total_rooms' => 20],
                ['room_type' => 'Deluxe', 'price' => 800000, 'cancellation_policy' => 'flexible', 'total_rooms' => 15],
                ['room_type' => 'Suite', 'price' => 1200000, 'cancellation_policy' => 'strict', 'total_rooms' => 10],
            ];

            foreach ($rates as $rate) {
                Rate::create($rate);
            }
        }

        // Tạo room mẫu nếu chưa có
        if (Room::count() == 0) {
            $rates = Rate::all();
            for ($i = 101; $i <= 150; $i++) {
                Room::create([
                    'room_number' => $i,
                    'bed_type' => ['single', 'double', 'triple'][array_rand(['single', 'double', 'triple'])],
                    'floor' => (int)($i / 100),
                    'facilities' => 'TV, AC, WiFi, Minibar',
                    'status' => 'available',
                    'rate_id' => $rates->random()->id,
                ]);
            }
        }

        // Tạo guest mẫu
        $guestNames = [
            ['Lewis', 'Hamilton'], ['Andrew', 'Johnson'], ['Mark', 'Wilson'], 
            ['Tate', 'Brown'], ['Manson', 'Davis'], ['Mike', 'Miller'],
            ['Bruce', 'Garcia'], ['Mave', 'Rodriguez'], ['Otis', 'Martinez'],
            ['Black', 'Anderson'], ['White', 'Taylor']
        ];

        $guests = [];
        foreach ($guestNames as $name) {
            $guests[] = Guest::create([
                'full_name' => $name[0] . ' ' . $name[1],
                'email' => strtolower($name[0] . '.' . $name[1]) . '@example.com',
                'phone' => '0' . rand(900000000, 999999999),
                'id_number' => rand(100000000, 999999999),
                'nationality' => 'Vietnam',
            ]);
        }

        // Tạo booking mẫu
        $rooms = Room::all();
        $statuses = ['pending', 'confirmed', 'checked_in', 'checked_out'];
        
        for ($i = 0; $i < 30; $i++) {
            $checkInDate = Carbon::now()->addDays(rand(-30, 60));
            $checkOutDate = $checkInDate->copy()->addDays(rand(1, 7));
            $status = $statuses[array_rand($statuses)];
            
            Booking::create([
                'booking_code' => 'BK' . str_pad($i + 1, 6, '0', STR_PAD_LEFT),
                'guest_id' => $guests[array_rand($guests)]->id,
                'room_id' => $rooms->random()->id,
                'check_in_date' => $checkInDate,
                'check_out_date' => $checkOutDate,
                'actual_check_in' => $status === 'checked_in' || $status === 'checked_out' ? $checkInDate : null,
                'actual_check_out' => $status === 'checked_out' ? $checkOutDate : null,
                'status' => $status,
                'adults' => rand(1, 3),
                'children' => rand(0, 2),
                'total_amount' => rand(500000, 2000000),
                'paid_amount' => rand(0, 1000000),
            ]);
        }
    }
}
