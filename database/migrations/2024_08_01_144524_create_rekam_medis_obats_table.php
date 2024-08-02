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
        Schema::create('rekam_medis_obats', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('rekam_medis_id')->unique();
            $table->foreign('rekam_medis_id')->references('id')->on('rekam_medis')->cascadeOnDelete();
            $table->unsignedBigInteger('obat_id')->unique();
            $table->foreign('obat_id')->references('id')->on('obats')->cascadeOnDelete();
            $table->integer('qty')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rekam_medis_obats');
    }
};
