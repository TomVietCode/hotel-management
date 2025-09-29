<?php

namespace App\Http\Controllers;

use App\Models\Rate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RateController extends Controller
{
    public function index(): Response {
      $rates = Rate::all();
      return Inertia::render('Rate', [
        'rates' => $rates
      ]);
    }
}
