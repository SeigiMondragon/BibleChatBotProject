<?php

use App\Http\Controllers\AIController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;



Route::prefix('auth')->controller(AuthController::class)->group(function(){
    Route::post('register', 'register');
    Route::post('login', 'login');
    Route::post('logout', 'logout');
});
