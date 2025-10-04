<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Room;
use App\Models\Guest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class FrontDeskController extends Controller
{
    /**
     * Display the front desk page
     */
    public function index(Request $request)
    {
        $currentDate = Carbon::now();
        $startDate = $currentDate->copy()->startOfMonth();
        $endDate = $currentDate->copy()->addMonths(11)->endOfMonth();

        // Get all bookings within the date range
        $bookings = Booking::with(['guest', 'room'])
            ->whereBetween('check_in_date', [$startDate, $endDate])
            ->orWhereBetween('check_out_date', [$startDate, $endDate])
            ->get();

        // Get booking counts by status
        $bookingCounts = [
            'due_in' => Booking::whereDate('check_in_date', $currentDate)
                ->whereIn('status', ['confirmed', 'pending'])
                ->count(),
            'checked_out' => Booking::whereDate('actual_check_out', $currentDate)
                ->where('status', 'checked_out')
                ->count(),
            'due_out' => Booking::whereDate('check_out_date', $currentDate)
                ->where('status', 'checked_in')
                ->count(),
            'checked_in' => Booking::where('status', 'checked_in')->count(),
        ];

        // Generate calendar data for 12 months
        $calendarData = [];
        for ($i = 0; $i < 12; $i++) {
            $monthStart = $currentDate->copy()->addMonths($i)->startOfMonth();
            $monthEnd = $monthStart->copy()->endOfMonth();
            
            $monthBookings = $bookings->filter(function ($booking) use ($monthStart, $monthEnd) {
                return $booking->check_in_date <= $monthEnd && $booking->check_out_date >= $monthStart;
            });

            $calendarData[] = [
                'month' => $monthStart->format('M'),
                'year' => $monthStart->format('Y'),
                'days' => $monthStart->daysInMonth,
                'bookings' => $monthBookings->map(function ($booking) use ($monthStart) {
                    return [
                        'id' => $booking->id,
                        'guest_name' => $booking->guest->full_name,
                        'room_number' => $booking->room->room_number,
                        'check_in' => $booking->check_in_date->format('Y-m-d'),
                        'check_out' => $booking->check_out_date->format('Y-m-d'),
                        'status' => $booking->status,
                        'start_day' => max(1, $booking->check_in_date >= $monthStart ? $booking->check_in_date->day : 1),
                        'duration' => $booking->nights,
                    ];
                })->values(),
            ];
        }

        return Inertia::render('FrontDesk/Index', [
            'bookingCounts' => $bookingCounts,
            'calendarData' => $calendarData,
            'currentMonth' => $currentDate->format('M'),
        ]);
    }

    /**
     * Get bookings by status
     */
    public function getBookingsByStatus(Request $request, $status)
    {
        $query = Booking::with(['guest', 'room']);
        $today = Carbon::today();

        switch ($status) {
            case 'due_in':
                $query->whereDate('check_in_date', $today)
                    ->whereIn('status', ['confirmed', 'pending']);
                break;
            case 'checked_out':
                $query->whereDate('actual_check_out', $today)
                    ->where('status', 'checked_out');
                break;
            case 'due_out':
                $query->whereDate('check_out_date', $today)
                    ->where('status', 'checked_in');
                break;
            case 'checked_in':
                $query->where('status', 'checked_in');
                break;
        }

        $bookings = $query->get();

        return response()->json($bookings);
    }
}
