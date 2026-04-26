<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        Schema::table('conversations', function (Blueprint $table) {
            $table->string('name')->unique()->after('id');
            $table->foreignId("user_id")->constrained("users");
        });

        Schema::table("messages", function (Blueprint $table) {
            $table->foreignId("conversation_id")->constrained("conversations");
            $table->text("message");
            $table->string("role");

        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
         Schema::table('conversations', function (Blueprint $table) {
            $table->dropColumn("name");
        });

        Schema::table("messages", function (Blueprint $table) {
            $table->dropColumn("conversation_id");
            $table->dropColumn("message");
            $table->dropColumn("role");

        });
    }
};
