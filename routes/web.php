<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RateController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
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
});

require __DIR__.'/auth.php';
