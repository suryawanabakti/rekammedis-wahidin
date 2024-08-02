<?php

namespace App\Http\Controllers;

use App\Models\Diagnosa;
use App\Models\Pasien;
use App\Models\RekamMedis;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RekamMedisController extends Controller
{
    public function index()
    {
        $rekamMedis = RekamMedis::with('pasien', 'dokter')->orderBy('created_at', 'DESC')->get()->map(function ($data) {
            $data['tanggal'] = $data->created_at->format('Y-m-d');
            return $data;
        });
        $pasiens = Pasien::orderBy('nama', 'ASC')->get();


        return Inertia::render("RekamMedis", ["rekamMedis" => $rekamMedis, "pasiens" => $pasiens]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'pasien_id' => ['required'],
            'diagnosa' => ['required', 'max:255'],
            'keluhan' => ['required'],
        ]);

        $validatedData['dokter_id'] = auth()->id();
        $rekamMedis = RekamMedis::create($validatedData);
        return RekamMedis::with('dokter', 'pasien')->findOrFail($rekamMedis->id);
    }
}
