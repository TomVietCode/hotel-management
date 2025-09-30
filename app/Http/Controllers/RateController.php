<?php

namespace App\Http\Controllers;

use App\Models\Rate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RateController extends Controller
{
    public function index(): Response {
      $rates = Rate::orderBy('created_at', 'desc')->get();
      return Inertia::render('Rate', [
        'rates' => $rates
      ]);
    }

    public function store(Request $request): RedirectResponse {
      $request->validate([
        'room_type' => 'required|string|max:255',
        'price' => 'required|numeric',
        'cancellation_policy' => 'required|string|max:255',
        'total_rooms' => 'required|integer',
      ]);
      
      Rate::create($request->all());
      
      return redirect()->intended(route('rates.index', absolute: false));
    }

    
    public function update(Request $request, Rate $rate): RedirectResponse
    {
        $validated = $request->validate([
            'room_type' => 'required|string|max:255',
            'price' => 'required|numeric',
            'cancellation_policy' => 'required|string|max:255',
            'total_rooms' => 'required|integer',
        ]);

        $rate->update($validated);

        return redirect()->intended(route('rates.index', absolute: false));
    }

    public function destroy(Rate $rate): RedirectResponse {
      $rate->delete();
      return redirect()->intended(route('rates.index', absolute: false));
    }
}
