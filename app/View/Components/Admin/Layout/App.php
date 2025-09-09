<?php

namespace App\View\Components\Admin\Layout;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class App extends Component {
  public function __construct() {}

  public function render(): View {
    return view('admin.layouts.app');
  }
}