<?php

namespace App\Http\Controllers;

use App\Models\Pasien;
use App\Models\RekamMedis;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PasienController extends Controller
{
    public function index()
    {
        return Inertia::render("Pasien", ["pasiens" => Pasien::orderBy('created_at', 'desc')->get()->map(function ($data) {
            $data['tanggal'] = $data->created_at->format('d M Y');
            return $data;
        })]);
    }

    public function show(Request $request)
    {
        $pasien = Pasien::where('id', $request->pasien)->first();
        $rekamMedis = RekamMedis::with('dokter', 'diagnosa')->where('pasien_id', $request->pasien)->get();
        return Inertia::render("DetailPasien", ["pasien" => $pasien, "rekamMedis" => $rekamMedis]);
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
            'jenis_pengobatan' => ['required'],
            'status_perkawinan' => [''],
            'pekerjaan' => [''],
            'pendidikan' => [''],
        ]);

        $user =  User::create([
            'nama' => $request->nama,
            'email' => $request->no_rm,
            'password' => bcrypt($request->no_rm),
            'role' => 'pasien'
        ]);

        $validatedData['user_id'] = $user->id;

        $pasien = Pasien::create($validatedData);
        $pasien['tanggal'] = $pasien->created_at->format('d M Y');
        return $pasien;
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
            'status_perkawinan' => [''],
            'pekerjaan' => [''],
            'pendidikan' => [''],
        ]);

        $pasien->update($validatedData);
        return $pasien;
    }

    public function destroy(Pasien $pasien)
    {
        $pasien->delete();
    }
}
