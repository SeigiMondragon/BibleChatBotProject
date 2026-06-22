<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement('CREATE EXTENSION IF NOT EXISTS vector SCHEMA public;');
Schema::create('bible_verses', function (Blueprint $table) {
            $table->id();
            $table->string('reference', 255);
            $table->text('content');

            // Your embedding column
            $table->vector('embedding', 1536)->nullable(); // 1536 is standard for OpenAI, change if using a different model

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bible_verses');
    }
};
