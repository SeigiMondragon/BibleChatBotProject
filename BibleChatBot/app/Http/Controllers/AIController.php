<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OpenAI\Laravel\Facades\OpenAI;
use App\Models\BibleVerse;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Support\Facades\Log;

class AIController extends Controller
{
    public function chat (Request $request){

        try {
 $userQuestion = $request->input('prompt');
        $userHistory = $request->input('history');
        $user = auth()->user();
        Log::channel('custom')->info($user);
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
            ...($userHistory ?? []),
            ['role' => 'user', 'content' => $userQuestion],
        ],


        ]);

     $titleResponse = OpenAI::chat()->create([
            'model' => 'gpt-4o',
            'messages' => [
                ['role' => 'system', 'content' => "Summarize the following conversation into a concise and descriptive title."],
         ...($userHistory ?? []),
                ['role' => 'user', 'content' => $userQuestion],
                ['role' => 'assistant', 'content' => $response->choices[0]->message->content],
            ],
        ]);

        $title = $titleResponse->choices[0]->message->content;


        $conversationId = $request->input('conversation_id');
        $conversation = null;

        if($conversationId){
            $conversation = Conversation::where('id', $conversationId)
            ->where('user_id', $user->id)
            ->first();
        }

        if(!$conversation){
            $conversation =Conversation::create([
                'name' => $title,
                'user_id' => $user->id,
            ]);
        }

        $messagesToSave = [
            [
                'conversation_id' => $conversation->id ?? null,
                'role' => 'user',
                'message' => $userQuestion,
            ],
            [
                'conversation_id' => $conversation->id ?? null,
                'role' => $response->choices[0]->message->role,
                'message' => $response->choices[0]->message->content,
            ],
        ];

        foreach ($messagesToSave as $messageData) {
            Message::create($messageData);
        }

        return response()->json([
            'conversation_id' => $conversation->id,
            "answer" => $response->choices[0]->message->content,
            "sources" => $verses->pluck('reference')
        ],200);
        }catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }

    }

    public function getAllConversationNames(){
        try {
            $user = auth()->user();
            $conversation_names = Conversation::where('user_id', $user->id)->pluck('name');
            $conversation_id = Conversation::where('user_id', $user->id)->pluck('id');
            return response()->json([
                "conversation_names" => $conversation_names,
                "conversation_id" => $conversation_id
            ],200);
        }catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }

    }

    public function getConversationMessages(  $conversation_id){
        $conversation = Conversation::where('id', $conversation_id)->first();;
        $messages = Message::where('conversation_id', $conversation->id)->get();
        return response()->json($messages,200);
    }
}
