<?php

use App\Http\Controllers\AIController;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\InjectCookieAuth;


Route::middleware('auth:api')->controller(AIController::class)->group(function(){
    Route::post('chat', 'chat');
    Route::get("conversationNames", "getAllConversationNames");
    Route::get("conversationMessages/{conversation_id}", "getConversationMessages");
    Route::get("conversationNameByName", "getConversationNameByName");
});
