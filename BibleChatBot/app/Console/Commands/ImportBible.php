<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use OpenAI\Laravel\Facades\OpenAI;

class ImportBible extends Command
{
    /**
     * The name and signature of the console command.
     * This is what you type: 'php artisan bible:import'
     */
    protected $signature = 'bible:import {--batch-size=100 : Number of verses to include in each embedded chunk}';

    /**
     * The console command description.
     */
    protected $description = 'Import Bible verses and generate AI embeddings';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $batchSize = max(1, (int) $this->option('batch-size'));
        $chaptersUrl = 'https://bible.helloao.org/api/BSB/books.json';

        try {
            $response = Http::get($chaptersUrl);
            $decodedResponse = json_decode($response->body(), true);
            $books = $decodedResponse['books'] ?? [];

            if (empty($books)) {
                $this->error('No books found from the Bible API response.');
                return Command::FAILURE;
            }

            foreach ($books as $book) {
                $chunkText = [];
                $chunkStartRef = null;
                $chunkEndRef = null;

                $bookId = $book['id'];
                $bookName = $book['name'];
                $chapterCount = (int) $book['numberOfChapters'];

                $this->info("Importing $bookName...");

                for ($chapterNumber = 1; $chapterNumber <= $chapterCount; $chapterNumber++) {
                    $chapterResponse = Http::get("https://bible.helloao.org/api/BSB/$bookId/$chapterNumber.json");
                    $decodedChapterResponse = json_decode($chapterResponse->body(), true);

                    $chapterContents = $decodedChapterResponse['chapter']['content'] ?? [];

                    foreach ($chapterContents as $content) {
                        if (($content['type'] ?? null) !== 'verse') {
                            continue;
                        }

                        $verseText = $this->flattenContent($content['content'] ?? []);

                        if (trim($verseText) === '') {
                            continue;
                        }

                        $verse = $content['number'];

                        if ($chunkStartRef === null) {
                            $chunkStartRef = "$bookName $chapterNumber:$verse";
                        }

                        $chunkEndRef = "$bookName $chapterNumber:$verse";
                        $chunkText[] = $verseText;

                        if (count($chunkText) === $batchSize) {
                            $this->saveChunk($chunkText, $chunkStartRef, $chunkEndRef);

                            $chunkText = [];
                            $chunkStartRef = null;
                            $chunkEndRef = null;
                        }
                    }
                }

                if (count($chunkText) > 0) {
                    $this->saveChunk($chunkText, $chunkStartRef, $chunkEndRef);
                }
            }
        } catch (\Exception $e) {
            $this->error($e->getMessage());
            return Command::FAILURE;
        }

        $this->info('Bible import complete!');

        return Command::SUCCESS;
    }

    private function flattenContent(array $content): string
    {
        $text = '';

        foreach ($content as $part) {
            if (is_string($part)) {
                $text .= $part . ' ';
            }

            if (is_array($part) && isset($part['text'])) {
                $text .= $part['text'] . ' ';
            }
        }

        return trim($text);
    }

    private function saveChunk(array $chunk, string $startRef, string $endRef): void
    {
        $chunkText = implode(' ', $chunk);
        $reference = $startRef . ' - ' . $endRef;

        $embedding = OpenAI::embeddings()->create([
            'model' => 'text-embedding-3-small',
            'input' => $chunkText,
        ]);

        DB::table('bible_verses')->insert([
            'reference' => $reference,
            'content' => $chunkText,
            'embedding' => json_encode($embedding->embeddings[0]->embedding),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->info("Imported $reference.");
    }
}
