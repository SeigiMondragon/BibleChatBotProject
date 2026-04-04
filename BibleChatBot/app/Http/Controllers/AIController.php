<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OpenAI\Laravel\Facades\OpenAI;
use App\Models\BibleVerse;
class AIController extends Controller
{
    public function chat (Request $request){
        $userQuestion = $request->input('prompt');
        $userHistory = $request->input('history');

        $response = OpenAI::embeddings()->create([
            'model' => 'text-embedding-ada-002',
            'input' => $userQuestion,
        ]);

        $queryVector = $response->embeddings[0]->embedding;

        $verses = BibleVerse::query()
        ->orderByRaw("embedding <=> '[" . implode(',', $queryVector) . "]'")
        ->limit(3)
        ->get();

        $context = $verses->map(fn($v) => "({$v->reference}) {$v->content}")->implode("\n");
        $response = OpenAI::chat()->create([
        'model' => 'gpt-4o',
        'messages' => [
            ['role' => 'system', 'content' => "You are a Bible Assistant. Answer the user question by using the information from the following verses: " . $context],
            ...$userHistory,
            ['role' => 'user', 'content' => $userQuestion],
        ],
    ]);

    return response()->json([
        "answer" => $response->choices[0]->message->content,
        "sources" => $verses->pluck('reference')
    ],200);
    }
}
