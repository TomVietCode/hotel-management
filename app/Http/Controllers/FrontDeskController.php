<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Room;
use App\Models\Guest;
use App\Models\Rate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
                        'floor' => $booking->room->floor,
                        'check_in' => $booking->check_in_date->format('d-m-Y'),
                        'check_out' => $booking->check_out_date->format('d-m-Y'),
                        'status' => $booking->status,
                        'start_day' => max(1, $booking->check_in_date >= $monthStart ? $booking->check_in_date->day : 1),
                        'duration' => $booking->nights,
                    ];
                })->values(),
            ];
        }

        return Inertia::render('FrontDesk/Index', [
            'calendarData' => $calendarData,
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

    public function createBooking()
    {
        $rates = Rate::all();

        return Inertia::render('FrontDesk/CreateBooking', [
          'rates' => $rates
        ]);
    }

    /**
     * Search for available rooms based on criteria
     */
    public function searchRooms(Request $request)
    {
        $request->validate([
            'check_in' => 'required|date',
            'check_out' => 'required|date|after:check_in',
            'bed_type' => 'nullable|string',
            'rate_id' => 'nullable|integer|exists:rates,id',
            'status' => 'required|in:all,available'
        ]);

        $query = Room::with('rate');

        // Filter by bed type if specified
        if ($request->bed_type) {
            $query->where('bed_type', $request->bed_type);
        }

        // Filter by rate (room type) if specified
        if ($request->rate_id) {
            $query->where('rate_id', $request->rate_id);
        }

        // Filter by availability if requested
        if ($request->status === 'available') {
            $checkIn = Carbon::parse($request->check_in);
            $checkOut = Carbon::parse($request->check_out);

            // Get rooms that don't have conflicting bookings
            $bookedRoomIds = Booking::where(function ($q) use ($checkIn, $checkOut) {
                $q->where(function ($subQ) use ($checkIn, $checkOut) {
                    $subQ->whereBetween('check_in_date', [$checkIn, $checkOut])
                        ->orWhereBetween('check_out_date', [$checkIn, $checkOut])
                        ->orWhere(function ($innerQ) use ($checkIn, $checkOut) {
                            $innerQ->where('check_in_date', '<=', $checkIn)
                                ->where('check_out_date', '>=', $checkOut);
                        });
                });
            })->whereIn('status', ['confirmed', 'checked_in', 'pending'])
                ->pluck('room_id');

            $query->whereNotIn('id', $bookedRoomIds)
                ->where('status', 'available');
        }

        $rooms = $query->get();

        return response()->json($rooms);
    }

    /**
     * Store a new booking
     */
    public function storeBooking(Request $request)
    {
        $request->validate([
            'guest.full_name' => 'required|string|max:255',
            'guest.email' => 'required|email|max:255',
            'guest.phone' => 'required|string|max:20',
            'guest.id_number' => 'required|string|max:20',
            'guest.gender' => 'required|in:male,female',
            'guest.date_of_birth' => 'required|date',
            'room_id' => 'required|integer|exists:rooms,id',
            'check_in_date' => 'required|date',
            'check_out_date' => 'required|date|after:check_in_date',
            'booking_code' => 'required|string|unique:bookings,booking_code',
            'total_amount' => 'required|numeric|min:0',
            'adults' => 'integer|min:1|max:10',
            'children' => 'integer|min:0|max:10',
        ]);

        try {
            DB::beginTransaction();

            // Create or find guest
            $guest = Guest::firstOrCreate(
                ['email' => $request->guest['email']],
                $request->guest
            );

            // Update room status to booked
            $room = Room::findOrFail($request->room_id);
            $room->update(['status' => 'booked']);

            // Create booking
            $booking = Booking::create([
                'booking_code' => $request->booking_code,
                'guest_id' => $guest->id,
                'room_id' => $request->room_id,
                'check_in_date' => $request->check_in_date,
                'check_out_date' => $request->check_out_date,
                'status' => 'confirmed',
                'adults' => $request->adults ?? 1,
                'children' => $request->children ?? 0,
                'total_amount' => $request->total_amount,
                'paid_amount' => 0,
                'special_requests' => $request->special_requests,
                'notes' => $request->notes,
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Đặt phòng thành công!');

        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->withErrors(['error' => 'Đặt phòng thất bại: ' . $e->getMessage()]);
        }
    }
}
