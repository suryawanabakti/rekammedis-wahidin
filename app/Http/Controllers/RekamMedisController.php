<?php

namespace App\Http\Controllers;

use App\Models\Diagnosa;
use App\Models\Obat;
use App\Models\Pasien;
use App\Models\RekamMedis;
use App\Models\RekamMedisObat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

use function Laravel\Prompts\error;

class RekamMedisController extends Controller
{
    public function index()
    {
        $rekamMedis = RekamMedis::with('pasien', 'dokter', 'obats.obat', 'diagnosa')->orderBy('created_at', 'DESC');

        if (auth()->user()->role == 'pasien') {
            $rekamMedis->where('pasien_id', Pasien::where('user_id', auth()->id())->first()->id);
        }
        $pasiens = Pasien::orderBy('nama', 'ASC')->get();
        $obats = Obat::all()->map(function ($data) {
            return [
                "id" => $data->id,
                "name" => $data->nama,
            ];
        });
        $diagnosas = Diagnosa::all();
        return Inertia::render("RekamMedis", ["rekamMedis" => $rekamMedis->get(), "pasiens" => $pasiens, "obats" => $obats, "diagnosas" => $diagnosas]);
    }

    public function store(Request $request)
    {

        $validatedData = $request->validate([
            'pasien_id' => ['required'],
            'diagnosa' => ['required', 'max:255'],
            'keluhan' => ['required'],
            'cara_keluar' => ['required'],
            'keadaan_keluar' => ['required'],
            'tgl_masuk' => ['required'],
            'tgl_keluar' => ['required'],
        ]);

        $validatedData['dokter_id'] = auth()->id();
        $validatedData['diagnosa_id'] = $request->diagnosa;
        return DB::transaction(function () use ($request, $validatedData) {
            $rekamMedis = RekamMedis::create($validatedData);
            foreach ($request->obats ?? [] as $obat) {
                RekamMedisObat::create([
                    "rekam_medis_id" => $rekamMedis->id,
                    "obat_id" => $obat['id'],
                ]);
            }
            return RekamMedis::with('dokter', 'pasien', 'obats')->findOrFail($rekamMedis->id);
        });
    }

    public function update(Request $request, RekamMedis $rekammedis)
    {

        $validatedData = $request->validate([
            'pasien_id' => ['required'],
            'diagnosa' => ['required', 'max:255'],
            'keluhan' => ['required'],
            'cara_keluar' => ['required'],
            'keadaan_keluar' => ['required'],
            'tgl_masuk' => ['required'],
            'tgl_keluar' => ['required'],
        ]);

        $validatedData['dokter_id'] = auth()->id();
        $validatedData['diagnosa_id'] = $request->diagnosa;
        return DB::transaction(function () use ($request, $validatedData, $rekammedis) {
            $rekammedis->update($validatedData);
            RekamMedisObat::where('rekam_medis_id', $rekammedis->id)->delete();
            foreach ($request->obats ?? [] as $obat) {
                RekamMedisObat::create([
                    "rekam_medis_id" => $rekammedis->id,
                    "obat_id" => $obat['id'],
                ]);
            }
            return RekamMedis::with('dokter', 'pasien', 'obats')->findOrFail($rekammedis->id);
        });
    }
}
