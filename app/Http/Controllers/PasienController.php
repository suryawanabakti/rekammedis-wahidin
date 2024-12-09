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
        if (auth()->user()->role == 'pasien') {
            return redirect('/dashboard');
        }
        return Inertia::render("Pasien", ["pasiens" => Pasien::with('user')->orderBy('created_at', 'desc')->get()->map(function ($data) {
            $data['tanggal'] = $data->created_at->format('d M Y');
            return $data;
        })]);
    }

    public function show(Pasien $pasien)
    {
        $rekamMedis = RekamMedis::with('dokter', 'obats.obat')->where('pasien_id', $pasien->id)->get();
        return Inertia::render("DetailPasien", ["pasien" => $pasien, "rekamMedis" => $rekamMedis]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'no_rm' => ['required', 'max:255'],
            'username' => ['required', 'max:255'],
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
            'email' => $request->username,
            'password' => bcrypt($request->username),
            'role' => 'pasien'
        ]);

        $validatedData['user_id'] = $user->id;

        $pasien = Pasien::create($validatedData);
        $pasien['tanggal'] = $pasien->created_at->format('d M Y');

        return $pasien->load('user');
    }

    public function update(Request $request, Pasien $pasien)
    {
        $validatedData = $request->validate([
            'no_rm' => ['required', 'max:255'],
            'nama' => ['required', 'max:255'],
            'username' => ['required', 'max:255'],
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
        $pasien->user()->update(['nama' => $request->nama, 'email' => $request->username]);
        $pasien->update($validatedData);
        return $pasien->load('user');
    }

    public function destroy(Pasien $pasien)
    {
        $pasien->delete();
    }
}
