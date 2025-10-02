<?php

namespace App\Http\Controllers;

use App\Models\Rate;
use App\Models\Room;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $filter = $request->get('filter', 'all'); // all, available, booked
        
        $query = Room::orderBy('floor', 'asc')->with('rate'); 
        
        if ($filter === 'available') {
            $query->where('status', 'available');
        } elseif ($filter === 'booked') {
            $query->whereIn('status', ['booked', 'reserved']);
        }
        
        $rooms = $query->paginate(6);

        $rates = Rate::orderBy('created_at', 'desc')->get();

        $roomCounts = Room::selectRaw('rate_id, COUNT(*) as count')
            ->groupBy('rate_id')
            ->pluck('count', 'rate_id');

        $finalRates = $rates->map(function ($rate) use ($roomCounts) {
            $usedRooms = $roomCounts[$rate->id] ?? 0;
            $rate->available_rooms = max(0, $rate->total_rooms - $usedRooms);
            return $rate;
        });

        return Inertia::render('Room', [
            'rooms' => $rooms,
            'rates' => $finalRates,
            'filter' => $filter
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'room_number' => [
                'required',
                'integer',
                Rule::unique('rooms')->where(function ($query) use ($request) {
                    return $query->where('floor', $request->input('floor'));
                }),
            ],
            'bed_type' => 'required|string|in:single,double,triple',
            'floor' => 'required|integer',
            'facilities' => 'nullable|string',
            'rate_id' => 'required|exists:rates,id',
        ]);

        // Mặc định trạng thái là available khi tạo mới phòng
        $validated['status'] = 'available';

        Room::create($validated);

        return redirect()->route('rooms.index')
            ->with('success', 'Phòng đã được tạo thành công!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Room $room)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Room $room)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Room $room): RedirectResponse
    {
        $validated = $request->validate([
            'room_number' => 'required|integer|unique:rooms,room_number,' . $room->id,
            'bed_type' => 'required|string|in:single,double,triple',
            'floor' => 'required|integer',
            'facilities' => 'nullable|string',
            'rate_id' => 'required|exists:rates,id',
            'status' => 'required|string|in:available,booked,reserved,blocked',
        ]);

        $room->update($validated);

        return redirect()->route('rooms.index')
            ->with('success', 'Phòng đã được cập nhật thành công!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Room $room): RedirectResponse
    {
        $room->delete();
        
        return redirect()->route('rooms.index')
            ->with('success', 'Phòng đã được xóa thành công!');
    }
}