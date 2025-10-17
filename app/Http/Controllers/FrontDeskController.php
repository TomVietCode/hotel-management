<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Room;
use App\Models\Guest;
use App\Models\Rate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

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
            'rates' => $rates,
        ]);
    }

    public function searchRooms(Request $request) {
      $validated = $request->validate([
        'bed_type' => 'nullable|string|in:single,double,triple',
        'rate_id' => 'nullable|exists:rates,id',
        'check_in_date' => 'required|date',
        'check_out_date' => 'required|date',
        'status' => 'required|string|in:all,available',
      ]);

      $query = Room::orderBy('floor', 'asc')->orderBy('room_number', 'asc')->with('rate');

      // Status filter
      if($validated['status'] === 'available') {
        $query->where('status', 'available');

        if($validated['check_in_date'] && $validated['check_out_date']) {
          $query->whereDoesntHave('bookings', function ($bookingQuery) use ($validated) {
            $bookingQuery->where(function ($q) use ($validated) {
              $q->whereBetween('check_in_date', [$validated['check_in_date'], $validated['check_out_date']])
                ->orWhereBetween('check_out_date', [$validated['check_in_date'], $validated['check_out_date']])
                ->orWhere(function ($q) use ($validated) {
                  $q->where('check_in_date', '<=', $validated['check_in_date'])
                    ->where('check_out_date', '>=', $validated['check_out_date']);
                });
            })->whereIn('status', ['confirmed', 'checked_in']);
          });  
        }
      }

      // Bed type filter
      if(!empty($validated['bed_type'])) {
        $query->where('bed_type', $validated['bed_type']);
      }

      // Rate filter
      if(!empty($validated['rate_id'])) {
        $query->where('rate_id', $validated['rate_id']);
      }

      $rooms = $query->paginate(4)->appends($validated);
      $rates = Rate::all();
      return Inertia::render('FrontDesk/CreateBooking', [
        'rates' => $rates,
        'searchResults' => $rooms,
        'searchCriteria' => $validated
      ]);
    }


    public function storeBooking(Request $request)
    {
        $request->validate([
            'guest.full_name' => 'required|string|max:255',
            'guest.email' => 'required|email|max:255',
            'guest.phone' => 'required|string|max:20',
            'guest.id_number' => 'string|max:20|nullable',
            'guest.gender' => 'required|in:male,female',
            'guest.date_of_birth' => 'date|nullable',
            'room_id' => 'required|integer|exists:rooms,id',
            'check_in_date' => 'required|date',
            'check_out_date' => 'required|date|after:check_in_date',
            'booking_code' => 'required|string|unique:bookings,booking_code',
            'total_amount' => 'required|numeric|min:0',
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
            Booking::create([
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
            dump($e);
            return redirect()->back()->withErrors(['error' => 'Đặt phòng thất bại: ' . $e->getMessage()]);
        }
    }
}
