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
        Schema::create('rekam_medis', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('pasien_id');
            $table->foreign('pasien_id')->references('id')->on('pasiens')->cascadeOnDelete();
            $table->unsignedBigInteger('dokter_id');
            $table->foreign('dokter_id')->references('id')->on('users')->cascadeOnDelete();
            $table->date('tgl_masuk');
            $table->date('tgl_keluar');
            $table->enum('keadaan_keluar', ['Sembuh', 'Membaik', 'Belum Sembuh', 'Mati < 48 Jam', 'Mati > 48 Jam']);
            $table->enum('cara_keluar', ['Diijinkan Pulang', 'Pulang Paksa', 'Dirujuk', 'Lari', 'Pindah RS']);
            $table->unsignedBigInteger('diagnosa_id');
            $table->foreign('diagnosa_id')->references('id')->on('diagnosas')->cascadeOnDelete();
            $table->text('keluhan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rekam_medis');
    }
};
