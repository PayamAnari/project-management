<?php

use Illuminate\Support\Facades\Route;


Route::get('/{any}', function () {
    return view('welcome'); 
})->where('any', '^(?!api).*$');


require __DIR__.'/auth.php';
