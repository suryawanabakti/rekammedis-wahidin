<?php

use App\Http\Controllers\DiagnosaController;
use App\Http\Controllers\DokterController;
use App\Http\Controllers\ObatController;
use App\Http\Controllers\PasienController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RekamMedisController;
use App\Models\Diagnosa;
use App\Models\Obat;
use App\Models\Pasien;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    $countPasien = Pasien::count();
    $countDokter = User::where('role', 'dokter')->count();
    $countObat = Obat::count();
    $countDiagnosa = Diagnosa::count();
    return Inertia::render('Dashboard', ["countPasien" => $countPasien, "countDokter" => $countDokter, "countObat" => $countObat, "countDiagnosa" => $countDiagnosa]);
})
    ->name('dashboard');
//    ->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/obat', [ObatController::class, 'index'])->name('obat.index');
    Route::post('/obat', [ObatController::class, 'store'])->name('obat.store');
    Route::patch('/obat/{obat}', [ObatController::class, 'update'])->name('obat.update');
    Route::delete('/obat/{obat}', [ObatController::class, 'destroy'])->name('obat.destroy');

    Route::get('/dokter', [DokterController::class, 'index'])->name('dokter.index');
    Route::post('/dokter', [DokterController::class, 'store'])->name('dokter.store');
    Route::patch('/dokter/{dokter}', [DokterController::class, 'update'])->name('dokter.update');
    Route::delete('/dokter/{dokter}', [DokterController::class, 'destroy'])->name('dokter.destroy');

    Route::get('/pasien', [PasienController::class, 'index'])->name('pasien.index');
    Route::post('/pasien', [PasienController::class, 'store'])->name('pasien.store');
    Route::patch('/pasien/{pasien}', [PasienController::class, 'update'])->name('pasien.update');
    Route::delete('/pasien/{pasien}', [PasienController::class, 'destroy'])->name('pasien.destroy');

    Route::get('/diagnosa', [DiagnosaController::class, 'index'])->name('diagnosa.index');
    Route::post('/diagnosa', [DiagnosaController::class, 'store'])->name('diagnosa.store');
    Route::patch('/diagnosa/{diagnosa}', [DiagnosaController::class, 'update'])->name('diagnosa.update');
    Route::delete('/diagnosa/{diagnosa}', [DiagnosaController::class, 'destroy'])->name('diagnosa.destroy');


    Route::get('/rekammedis', [RekamMedisController::class, 'index'])->name('rekammedis.index');
    Route::post('/rekammedis', [RekamMedisController::class, 'store'])->name('rekammedis.store');
    Route::patch('/rekammedis/{rekammedis}', [RekamMedisController::class, 'update'])->name('rekammedis.update');
    Route::delete('/rekammedis/{rekammedis}', [RekamMedisController::class, 'destroy'])->name('rekammedis.destroy');



    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


Route::get('/uikit/button', function () {
    return Inertia::render('main/uikit/button/page');
})->name('button');





require __DIR__ . '/auth.php';
