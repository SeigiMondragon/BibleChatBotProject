<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\BibleVerse;
use OpenAI\Laravel\Facades\OpenAI; // Use the 8.2 compatible facade

class ImportBible extends Command
{
    /**
     * The name and signature of the console command.
     * This is what you type: 'php artisan bible:import'
     */
    protected $signature = 'bible:import';

    /**
     * The console command description.
     */
    protected $description = 'Import Bible verses and generate AI embeddings';

    /**
     * Execute the console command.
     */
    public function handle()
{
    $path = storage_path('bible.json'); // Updated to match your filename

    if (!file_exists($path)) {
        $this->error("Bible file not found at: $path");
        return;
    }

    $json = file_get_contents($path);
    $data = json_decode($json, true);

    // In your JSON, all verses are in a flat array under the 'verses' key
    $verses = $data['verses'] ?? [];

    if (empty($verses)) {
        $this->error('No verses found in bible.json.');
        return;
    }

    $this->info("Starting import of " . count($verses) . " verses...");

    // Process in larger chunks to speed up the import.
    // Each chunk will be sent as a single embeddings request with many inputs.
    $batchSize = 100; // adjust if you hit rate limits
    $chunks = array_chunk($verses, $batchSize);

    foreach ($chunks as $chunkIndex => $chunk) {
        // Collect verse texts for this chunk
        $inputs = [];
        foreach ($chunk as $verseData) {
            $inputs[] = $verseData['text'];
        }

        try {
            // 1. Get embeddings for all verses in this chunk with a single API call
            $response = OpenAI::embeddings()->create([
                'model' => 'text-embedding-3-small',
                'input' => $inputs,
            ]);

            if (!isset($response->embeddings) || count($response->embeddings) !== count($chunk)) {
                throw new \RuntimeException('Embedding count does not match verse count in batch.');
            }

            // 2. Store each verse with its corresponding embedding
            foreach ($chunk as $i => $verseData) {
                $bookName = $verseData['book_name'];
                $chapter = $verseData['chapter'];
                $verseNum = $verseData['verse'];
                $verseText = $verseData['text'];

                $reference = "$bookName $chapter:$verseNum";

                $embeddingArray = $response->embeddings[$i]->embedding;

                if (!is_array($embeddingArray)) {
                    throw new \RuntimeException("Embedding response for $reference was not an array as expected.");
                }

                $embeddingString = '[' . implode(',', array_map('strval', $embeddingArray)) . ']';

                BibleVerse::create([
                    'reference' => $reference,
                    'content' => $verseText,
                    'embedding' => $embeddingString,
                ]);
            }
        } catch (\Exception $e) {
            $this->error('Failed to import batch ' . ($chunkIndex + 1) . ': ' . $e->getMessage());
        }

        $this->info('Imported batch ' . ($chunkIndex + 1) . ' of ' . count($chunks) . '...');

        // Short sleep between batches to be gentle with rate limits
        usleep(200000); // 0.2 seconds
    }

    $this->info("Bible import complete!");
}
}
