<?php

use App\Http\Controllers\AIController;
use Illuminate\Support\Facades\Route;



Route::middleware('auth:sanctum')->controller(AIController::class)->group(function(){
    Route::post('chat', 'chat');
});
