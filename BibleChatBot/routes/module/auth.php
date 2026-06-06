<?php

use App\Http\Controllers\AIController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\InjectCookieAuth;


Route::prefix('auth')->controller(AuthController::class)->group(function(){
    Route::post('register', 'register');
    Route::post('login', 'login');
});

Route::prefix("auth")->middleware(['auth:api', InjectCookieAuth::class ])->controller(AuthController::class)->group(function(){
    Route::post('logout', 'logout');
    Route::get('me', 'getMe');
    Route::post('refresh', 'refresh');
});
