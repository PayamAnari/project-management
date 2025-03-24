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
        // For PostgreSQL
        if (config('database.default') === 'pgsql') {
            DB::statement("ALTER TABLE tasks DROP CONSTRAINT tasks_status_check");
            DB::statement("ALTER TABLE tasks ADD CONSTRAINT tasks_status_check CHECK (status IN ('to_do', 'in_progress', 'under_review', 'completed'))");
        }
        // For MySQL
        else {
            Schema::table('tasks', function (Blueprint $table) {
                $table->enum('status', ['to_do', 'in_progress', 'under_review', 'completed'])
                      ->default('to_do')
                      ->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // For PostgreSQL
        if (config('database.default') === 'pgsql') {
            DB::statement("ALTER TABLE tasks DROP CONSTRAINT tasks_status_check");
            DB::statement("ALTER TABLE tasks ADD CONSTRAINT tasks_status_check CHECK (status IN ('pending', 'in_progress', 'completed'))");
        }
        // For MySQL
        else {
            Schema::table('tasks', function (Blueprint $table) {
                $table->enum('status', ['pending', 'in_progress', 'completed'])
                      ->default('pending')
                      ->change();
            });
        }
    }
};