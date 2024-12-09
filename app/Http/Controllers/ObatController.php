<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Obat;
use App\Models\Satuan;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ObatController extends Controller
{
    public function index()
    {
        if (auth()->user()->role == 'pasien') {
            return redirect('/dashboard');
        }
        $satuans = Satuan::all();
        $categories = Category::all();

        return Inertia::render("Obat", ["obats" => Obat::with(['satuan', 'category'])->orderBy('created_at', 'desc')->get(), "categories" => $categories, "satuans" => $satuans]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nama' => ['required', 'max:255'],
            'category_id' => ['required', 'max:255'],
            'satuan_id' => ['required', 'max:255'],
            'kode' => ['required', 'max:255']
        ]);

        $obat =  Obat::create($validatedData);
        return $obat->load('satuan', 'category');
    }

    public function update(Request $request, Obat $obat)
    {
        $validatedData = $request->validate([
            'nama' => ['required', 'max:255'],
            'category_id' => ['required', 'max:255'],
            'satuan_id' => ['required', 'max:255'],
            'kode' => ['required', 'max:255', Rule::unique(Obat::class, 'kode')->ignore($obat->id)]
        ]);
        $obat->update($validatedData);
        return $obat->load('satuan', 'category');
    }

    public function destroy(Obat $obat)
    {
        $obat->delete();
    }
}
