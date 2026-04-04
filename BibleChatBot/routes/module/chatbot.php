<?php

use App\Http\Controllers\AIController;
use Illuminate\Support\Facades\Route;



Route::controller(AIController::class)->group(function(){
    Route::post('chat', 'chat');
});
