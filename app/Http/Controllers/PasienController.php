<?php

namespace App\Http\Controllers;

use App\Models\Pasien;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PasienController extends Controller
{
    public function index()
    {
        return Inertia::render("Pasien", ["pasiens" => Pasien::orderBy('created_at', 'desc')->get()]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'no_rm' => ['required', 'max:255'],
            'nama' => ['required', 'max:255'],
            'nik' => ['required', 'max:255'],
            'no_bpjs' => ['required', 'max:255'],
            'gol_darah' => ['required', 'max:255'],
            'tgl_lahir' => ['required', 'max:255'],
            'alamat' => ['required', 'max:255'],
            'no_hp' => ['required', 'max:255'],
        ]);

        return Pasien::create($validatedData);
    }

    public function update(Request $request, Pasien $pasien)
    {
        $validatedData = $request->validate([
            'no_rm' => ['required', 'max:255'],
            'nama' => ['required', 'max:255'],
            'nik' => ['required', 'max:255'],
            'no_bpjs' => ['required', 'max:255'],
            'gol_darah' => ['required', 'max:255'],
            'tgl_lahir' => ['required', 'max:255'],
            'alamat' => ['required', 'max:255'],
            'no_hp' => ['required', 'max:255'],
        ]);

        $pasien->update($validatedData);
        return $pasien;
    }

    public function destroy(Pasien $pasien)
    {
        $pasien->delete();
    }
}
