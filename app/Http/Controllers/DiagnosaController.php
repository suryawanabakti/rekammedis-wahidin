<?php

namespace App\Http\Controllers;

use App\Models\Diagnosa;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class DiagnosaController extends Controller
{
    public function index()
    {
        return Inertia::render("Diagnosa", ["diagnosas" => Diagnosa::orderBy('created_at', 'desc')->get()]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nama' => ['required', 'max:255'],
            'kode' => ['required', 'max:255']
        ]);

        return Diagnosa::create($validatedData);
    }

    public function update(Request $request, Diagnosa $diagnosa)
    {
        $validatedData = $request->validate([
            'nama' => ['required', 'max:255'],
            'kode' => ['required', 'max:255', Rule::unique(Diagnosa::class, 'kode')->ignore($diagnosa->id)]
        ]);

        $diagnosa->update($validatedData);
        return $diagnosa;
    }

    public function destroy(Diagnosa $diagnosa)
    {
        $diagnosa->delete();
    }
}
