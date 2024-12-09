<?php

namespace App\Http\Controllers;

use App\Models\Satuan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SatuanController extends Controller
{
    public function index()
    {
        if (auth()->user()->role == 'pasien') {
            return redirect('/dashboard');
        }
        return Inertia::render("Satuan", ["satuans" => Satuan::orderBy('created_at', 'desc')->get()]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nama' => ['required', 'max:255'],
            'singkatan' => ['required', 'max:255']
        ]);
        return Satuan::create($validatedData);
    }

    public function update(Request $request, Satuan $satuan)
    {
        $validatedData = $request->validate([
            'nama' => ['required', 'max:255'],
            'singkatan' => ['required']
        ]);
        $satuan->update($validatedData);
        return $satuan;
    }

    public function destroy(Satuan $satuan)
    {
        $satuan->delete();
    }
}
