<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;

class BibleImportController extends Controller
{
    public function import()
    {
        try {
            $exitCode = Artisan::call('bible:import');

            if ($exitCode !== 0) {
                return response()->json([
                    'error' => 'Bible import failed.',
                    'output' => Artisan::output(),
                ], 500);
            }

            return response()->json([
                'message' => 'Bible imported successfully',
                'output' => Artisan::output(),
            ], 200);

        } catch (\Exception $e) {
            Log::error('Bible import failed', ['exception' => $e]);

            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
