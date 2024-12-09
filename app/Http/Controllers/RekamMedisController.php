<?php

namespace App\Http\Controllers;

use App\Models\Diagnosa;
use App\Models\Obat;
use App\Models\Pasien;
use App\Models\RekamMedis;
use App\Models\RekamMedisObat;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

use function Laravel\Prompts\error;

class RekamMedisController extends Controller
{
    public function surat(RekamMedis $rekammedis)
    {
        return view('pdf.surat', compact('rekammedis'));
    }
    public function printAll()
    {
        $rekamMedis = RekamMedis::with(['dokter', 'diagnosa', 'obats.obat'])->get();
        $pdf = Pdf::loadView('pdf.all', compact('rekamMedis'));
        return $pdf->stream();
    }
    public function print(RekamMedis $rekammedis)
    {
        $pdf = Pdf::loadView('pdf.cetak', compact('rekammedis'));
        return $pdf->stream();
    }

    public function index()
    {
        $rekamMedis = RekamMedis::with('pasien', 'dokter', 'obats.obat')->orderBy('created_at', 'DESC');

        if (auth()->user()->role == 'pasien') {
            $rekamMedis->where('pasien_id', Pasien::where('user_id', auth()->id())->first()->id);
        }
        $pasiens = Pasien::orderBy('nama', 'ASC')->get()->map(function ($data) {
            return [
                "id" => $data->id,
                "nama" => "{$data->no_rm} - {$data->nama}",
            ];
        });

        $obats = Obat::all()->map(function ($data) {
            return [
                "id" => $data->id,
                "name" => "{$data->nama}",
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
            'obats' => ['required'],
            'diagnosa_akhir' => ['required', 'max:255'],
            'nomor_surat' => ['nullable', 'required_if:cara_keluar,Dirujuk'],
            'dirujuk_ke' => ['nullable', 'required_if:cara_keluar,Dirujuk'],
        ]);

        $validatedData['dokter_id'] = auth()->id();

        return DB::transaction(function () use ($request, $validatedData) {
            $rekamMedis = RekamMedis::create($validatedData);
            foreach ($request->obats ?? [] as $obat) {
                RekamMedisObat::create([
                    "rekam_medis_id" => $rekamMedis->id,
                    "obat_id" => $obat['id'],
                    "pemberian" => "-"
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
            'obats' => ['required'],
            'diagnosa_akhir' => ['required', 'max:255'],
            'nomor_surat' => ['nullable', 'required_if:cara_keluar,Dirujuk'],
            'dirujuk_ke' => ['nullable', 'required_if:cara_keluar,Dirujuk'],
        ]);

        $validatedData['dokter_id'] = auth()->id();

        return DB::transaction(function () use ($request, $validatedData, $rekammedis) {
            $rekammedis->update($validatedData);
            RekamMedisObat::where('rekam_medis_id', $rekammedis->id)->delete();
            foreach ($request->obats ?? [] as $obat) {
                RekamMedisObat::create([
                    "rekam_medis_id" => $rekammedis->id,
                    "obat_id" => $obat['id'],
                    "pemberian" => "-"
                ]);
            }
            return RekamMedis::with('dokter', 'pasien', 'obats')->findOrFail($rekammedis->id);
        });
    }

    public function destroy(RekamMedis $rekammedis)
    {
        $rekammedis->delete();
    }
}
