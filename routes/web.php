<?php

use Illuminate\Support\Facades\Route;


Route::get('/{any}', function () {
    return view('welcome'); // or your main Blade view
})->where('any', '.*');


require __DIR__.'/auth.php';
