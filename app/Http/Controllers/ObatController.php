<?php

namespace App\Http\Controllers;

use App\Models\Obat;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ObatController extends Controller
{
    public function index()
    {
        return Inertia::render("Obat", ["obats" => Obat::orderBy('created_at', 'desc')->get()]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nama' => ['required', 'max:255'],
            'kode' => ['required', 'max:255']
        ]);

        return Obat::create($validatedData);
    }

    public function update(Request $request, Obat $obat)
    {
        $validatedData = $request->validate([
            'nama' => ['required', 'max:255'],
            'kode' => ['required', 'max:255', Rule::unique(Obat::class, 'kode')->ignore($obat->id)]
        ]);

        $obat->update($validatedData);
        return $obat;
    }

    public function destroy(Obat $obat)
    {
        $obat->delete();
    }
}
