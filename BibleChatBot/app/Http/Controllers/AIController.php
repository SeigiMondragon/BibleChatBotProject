<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OpenAI\Laravel\Facades\OpenAI;
use App\Models\BibleVerse;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AIController extends Controller
{
    public function chat (Request $request){

        try {
 $userQuestion = $request->input('prompt');
        $userHistory = $request->input('history');
        $user = Auth::user();
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
            ['role' => 'system', 'content' => "You are a well-versed Bible Scholar. Your task is to answer the user's question as long as it is about the Bible Query, Holy Living, and even Bible Verse Implications:

            ## This is the Question of the user: {$context}

            If you are being asked about something that concerns Bible, Holy Living, or Bible Verse Implications, please answer the question. If you are asked about something else, please respond with 'I'm sorry, I don't know how to help with that.'
            "],
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
            $user = Auth::user();
            $conversations = Conversation::where('user_id', $user->id)
                ->orderByDesc('id')
                ->get(['id', 'name']);
            return response()->json([
                "conversation_names" => $conversations->pluck('name'),
                "conversation_id" => $conversations->pluck('id')
            ],200);
        }catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }

    }

public function getConversationMessages( $conversation_id){
        $conversation = Conversation::where('id', $conversation_id)->first();;
        $messages = Message::where('conversation_id', $conversation->id)->get();
        return response()->json($messages,200);
    }

 public function getConversationNameByName(Request $request){
        try {
            $user = Auth::user();
            $searchTerm = trim((string) ($request->input('query') ?? $request->input('name') ?? ''));

            if ($searchTerm === '') {
                return response()->json([
                    'success' => true,
                    'conversations' => [],
                ], 200);
            }

            $conversations = Conversation::query()
                ->where('user_id', $user->id)
                ->where('name', 'ILIKE', "%{$searchTerm}%")
                ->orderByDesc('id')
                ->get();

            return response()->json([
                'success' => true,
                "conversations" => $conversations

            ],200);
        }catch(\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
