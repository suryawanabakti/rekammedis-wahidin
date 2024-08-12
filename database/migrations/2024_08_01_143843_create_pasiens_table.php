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
        Schema::create('pasiens', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->string('no_rm')->nullable();
            $table->enum('jk', ['L', 'P']);
            $table->string('nama')->nullable();
            $table->string('nik')->nullable();
            $table->string('no_bpjs')->nullable();
            $table->string('gol_darah')->nullable();
            $table->string('tgl_lahir')->nullable();
            $table->string('alamat')->nullable();
            $table->string('no_hp')->nullable();
            $table->enum('jenis_pengobatan', ['Umum', 'BPJS']);
            $table->enum('status_perkawinan', ['Kawin', 'Belum Kawin']);
            $table->enum('pendidikan', ['Tidak Sekolah', 'Belum Sekolah', 'TK', 'SD', 'SLTP', 'SLTA', 'Akademi', 'S1', 'S2', 'S3'])->nullable();
            $table->enum('pekerjaan', ['Pelajar/Mahasiswa', 'Wiraswasta', 'PNS', 'Pensiunan', 'Pegawai Swasta', 'Tidak Bekerja', 'Profesional', 'IRT', 'TNI/POLRI', 'Petani/Buruh/Nelayan/Lainnya'])->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pasiens');
    }
};
