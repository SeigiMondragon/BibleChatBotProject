<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BibleImportController;

Route::prefix('import')->controller(BibleImportController::class)->group(function(){
    Route::post('bible', 'import');
});
