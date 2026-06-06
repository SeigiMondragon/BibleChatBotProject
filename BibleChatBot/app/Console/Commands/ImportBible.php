<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use OpenAI\Laravel\Facades\OpenAI;

class ImportBible extends Command
{
    /**
     * The name and signature of the console command.
     * This is what you type: 'php artisan bible:import'
     */
    protected $signature = 'bible:import {--batch-size=100 : Number of verses to embed per request}';

    /**
     * The console command description.
     */
    protected $description = 'Import Bible verses and generate AI embeddings';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $path = storage_path('bible.json');

        if (!file_exists($path)) {
            $this->error("Bible file not found at: $path");
            return Command::FAILURE;
        }

        $json = file_get_contents($path);
        $data = json_decode($json, true);
        $verses = $data['verses'] ?? [];

        if (empty($verses)) {
            $this->error('No verses found in bible.json.');
            return Command::FAILURE;
        }

        $batchSize = max(1, (int) $this->option('batch-size'));
        $chunks = array_chunk($verses, $batchSize);

        $this->info('Starting import of ' . count($verses) . ' verses in ' . count($chunks) . ' batches...');

        foreach ($chunks as $chunkIndex => $chunk) {
            $inputs = array_map(static fn (array $verseData) => $verseData['text'], $chunk);

            try {
                $response = OpenAI::embeddings()->create([
                    'model' => 'text-embedding-3-small',
                    'input' => $inputs,
                ]);

                if (!isset($response->embeddings) || count($response->embeddings) !== count($chunk)) {
                    throw new \RuntimeException('Embedding count does not match verse count in batch.');
                }

                $rows = [];

                foreach ($chunk as $i => $verseData) {
                    $reference = $verseData['book_name'] . ' ' . $verseData['chapter'] . ':' . $verseData['verse'];
                    $embeddingArray = $response->embeddings[$i]->embedding;

                    if (!is_array($embeddingArray)) {
                        throw new \RuntimeException("Embedding response for $reference was not an array as expected.");
                    }

                    $rows[] = [
                        'reference' => $reference,
                        'content' => $verseData['text'],
                        'embedding' => '[' . implode(',', array_map('strval', $embeddingArray)) . ']',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                DB::table('bible_verses')->insert($rows);

                $this->info('Imported batch ' . ($chunkIndex + 1) . ' of ' . count($chunks) . '.');
            } catch (\Exception $e) {
                $this->error('Failed to import batch ' . ($chunkIndex + 1) . ': ' . $e->getMessage());
            }
        }

        $this->info('Bible import complete!');

        return Command::SUCCESS;
    }
}
