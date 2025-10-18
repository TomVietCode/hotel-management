<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Room;
use App\Models\Guest;
use App\Models\Rate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with statistics
     */
    public function index(): Response
    {
        // Key Metrics
        $totalRooms = Room::count();
        $totalGuests = Guest::count();
        $totalBookings = Booking::count();
        $totalRevenue = Booking::where('status', 'checked_out')->sum('total_amount');

        // Current Status
        $availableRooms = Room::where('status', 'available')->count();
        $occupiedRooms = Room::where('status', 'booked')->count();
        $currentGuests = Booking::where('status', 'checked_in')->count();
        $todayCheckIns = Booking::whereDate('check_in_date', Carbon::today())
                                ->where('status', 'confirmed')
                                ->count();
        $todayCheckOuts = Booking::whereDate('check_out_date', Carbon::today())
                                 ->where('status', 'checked_in')
                                 ->count();
        // Room Status Distribution for Pie Chart
        $roomStatusData = [
            ['name' => 'Phòng trống', 'y' => $availableRooms, 'color' => '#41C588'],
            ['name' => 'Đã đặt', 'y' => $occupiedRooms, 'color' => '#F36960'],
            ['name' => 'Bảo trì', 'y' => Room::where('status', 'blocked')->count(), 'color' => '#858D9D'],
        ];

        // Monthly Revenue Trend (Last 6 months)
        $monthlyRevenue = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $revenue = Booking::whereYear('check_out_date', $month->year)
                            ->whereMonth('check_out_date', $month->month)
                            ->where('status', 'checked_out')
                            ->sum('total_amount');
            
            $monthlyRevenue[] = [
                'month' => $month->format('M Y'),
                'revenue' => (float) $revenue
            ];
        }

        // Booking Status Distribution
        $bookingStatusData = [
            ['name' => 'Đã xác nhận', 'y' => Booking::where('status', 'confirmed')->count(), 'color' => '#448DF2'],
            ['name' => 'Đã check-in', 'y' => Booking::where('status', 'checked_in')->count(), 'color' => '#41C588'],
            ['name' => 'Đã check-out', 'y' => Booking::where('status', 'checked_out')->count(), 'color' => '#F9A63A'],
        ];

        // Popular Room Types
        $popularRoomTypes = Rate::withCount(['rooms as total_bookings' => function ($query) {
                $query->join('bookings', 'rooms.id', '=', 'bookings.room_id');
            }])
            ->orderBy('total_bookings', 'desc')
            ->take(5)
            ->get()
            ->map(function ($rate) {
                return [
                    'room_type' => $rate->room_type,
                    'bookings' => $rate->total_bookings,
                    'price' => $rate->price
                ];
            });

        // Weekly Occupancy Rate (Last 7 days)
        $weeklyOccupancy = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $weeklyOccupiedRooms = Booking::whereDate('check_in_date', '<=', $date)
                                  ->whereDate('check_out_date', '>', $date)
                                  ->where('status', 'checked_in')
                                  ->count();
            
            $occupancyRate = $totalRooms > 0 ? ($weeklyOccupiedRooms / $totalRooms) * 100 : 0;
            
            $weeklyOccupancy[] = [
                'date' => $date->format('M d'),
                'occupancy' => round($occupancyRate, 1)
            ];
        }

        // Recent Bookings
        $recentBookings = Booking::with(['guest', 'room.rate'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'booking_code' => $booking->booking_code,
                    'guest_name' => $booking->guest->full_name,
                    'room_number' => $booking->room->floor . str_pad($booking->room->room_number, 2, '0', STR_PAD_LEFT),
                    'check_in_date' => $booking->check_in_date->format('d/m/Y'),
                    'status' => $booking->getDisplayStatus(),
                    'total_amount' => $booking->total_amount,
                ];
            });

        return Inertia::render('Dashboard', [
            'keyMetrics' => [
                'totalRooms' => $totalRooms,
                'totalGuests' => $totalGuests,
                'totalBookings' => $totalBookings,
                'totalRevenue' => $totalRevenue,
                'availableRooms' => $availableRooms,
                'occupiedRooms' => $occupiedRooms,
                'currentGuests' => $currentGuests,
                'todayCheckIns' => $todayCheckIns,
                'todayCheckOuts' => $todayCheckOuts,
            ],
            'charts' => [
                'roomStatus' => $roomStatusData,
                'monthlyRevenue' => $monthlyRevenue,
                'bookingStatus' => $bookingStatusData,
                'weeklyOccupancy' => $weeklyOccupancy,
            ],
            'popularRoomTypes' => $popularRoomTypes,
            'recentBookings' => $recentBookings,
        ]);
    }
}