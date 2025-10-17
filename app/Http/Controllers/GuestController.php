<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class GuestController extends Controller
{
    /**
     * Display a listing of guest bookings.
     */
    public function index(Request $request): Response
    {
        $query = Booking::with(['guest', 'room.rate']);
        
        // Filter by status
        if ($request->filled('status')) {
            switch ($request->status) {
                case 'not_checked_in':
                    $query->where('status', 'confirmed');
                    break;
                case 'not_checked_out':
                    $query->where('status', 'checked_in');
                    break;
                case 'checked_out':
                    $query->where('status', 'checked_out');
                    break;
                case 'late_checkout':
                    $query->where('status', 'checked_in')
                          ->where('check_out_date', '<', now()->toDateString());
                    break;
            }
        }
        
        // Search by room number
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->whereHas('room', function ($roomQuery) use ($searchTerm) {
                // Remove # if present and search by room number pattern
                $cleanSearch = str_replace('#', '', $searchTerm);
                
                $roomQuery->where(function ($subQuery) use ($cleanSearch) {
                    $subQuery->where('room_number', 'LIKE', "%{$cleanSearch}%")
                        ->orWhere('floor', 'LIKE', "%{$cleanSearch}%")
                        ->orWhereRaw("(floor || CASE WHEN room_number < 10 THEN '0' || room_number ELSE room_number END) LIKE ?", ["%{$cleanSearch}%"]);
                });
            });
        }
        
        $bookings = $query->orderBy('created_at', 'desc')
            ->paginate(7)
            ->through(function ($booking) {
                return [
                    'id' => $booking->id,
                    'booking_code' => $booking->booking_code,
                    'guest_name' => $booking->guest->full_name,
                    'guest_phone' => $booking->guest->phone,
                    'room_number' => $booking->room->floor . str_pad($booking->room->room_number, 2, '0', STR_PAD_LEFT),
                    'room_type' => $booking->room->rate->room_type,
                    'bed_type' => $booking->room->bed_type,
                    'check_in_date' => $booking->check_in_date->format('d/m/Y'),
                    'check_out_date' => $booking->check_out_date->format('d/m/Y'),
                    'nights' => $booking->nights,
                    'total_amount' => $booking->total_amount,
                    'status' => $booking->getDisplayStatus(),
                    'raw_status' => $booking->status,
                ];
            });

        return Inertia::render('Guest/Index', [
            'bookings' => $bookings,
            'filters' => [
                'status' => $request->status,
                'search' => $request->search,
            ]
        ]);
    }

    /**
     * Update booking status to checked_in
     */
    public function checkIn(Request $request, Booking $booking): RedirectResponse
    {
        if ($booking->status !== 'confirmed') {
            return redirect()->back()->withErrors(['error' => 'Chỉ có thể check-in cho booking đã confirmed.']);
        }

        $booking->update([
            'status' => 'checked_in',
            'actual_check_in' => now()
        ]);

        // Update room status to booked
        $booking->room->update(['status' => 'booked']);

        return redirect()->back()->with('success', 'Check-in thành công!');
    }

    /**
     * Update booking status to checked_out
     */
    public function checkOut(Request $request, Booking $booking): RedirectResponse
    {
        if ($booking->status !== 'checked_in') {
            return redirect()->back()->withErrors(['error' => 'Chỉ có thể check-out cho booking đã checked-in.']);
        }

        $booking->update([
            'status' => 'checked_out',
            'actual_check_out' => now()
        ]);

        // Update room status to available
        $booking->room->update(['status' => 'available']);

        return redirect()->back()->with('success', 'Check-out thành công!');
    }
}