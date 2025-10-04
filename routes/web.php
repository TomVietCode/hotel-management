<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RateController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
  if (Auth::check()) {
      return redirect()->route('dashboard');
  } else {
      return redirect()->route('login');
  }
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Rates
    Route::get('/rates', [RateController::class, 'index'])->name('rates.index');
    Route::post('/rates', [RateController::class, 'store'])->name('rates.store');
    Route::patch('/rates/{rate}', [RateController::class, 'update'])->name('rates.update');
    Route::delete('/rates/{rate}', [RateController::class, 'destroy'])->name('rates.destroy');
    
    // Rooms
    Route::resource('rooms', \App\Http\Controllers\RoomController::class);
    
    // Front Desk
    Route::get('/front-desk', [\App\Http\Controllers\FrontDeskController::class, 'index'])->name('front-desk.index');
    Route::get('/front-desk/bookings/{status}', [\App\Http\Controllers\FrontDeskController::class, 'getBookingsByStatus'])->name('front-desk.bookings');
});

require __DIR__.'/auth.php';
