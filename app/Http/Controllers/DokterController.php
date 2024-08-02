<?php

namespace App\Http\Controllers;

use App\Models\Dokter;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class DokterController extends Controller
{
    public function index()
    {
        return Inertia::render("Dokter", ["dokters" => Dokter::with('user')->orderBy('created_at', 'DESC')->get()]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            "kode" => ['required', 'max:255'],
            "nama" => ['required', 'max:255'],
            "email" => ['required', 'max:255', 'email', Rule::unique(User::class, "email")],
            "password" => ['required']
        ]);

        $validatedData['password'] = bcrypt($request->password);
        $validatedData['role'] = 'dokter';
        $user = User::create($validatedData);

        $dokter = Dokter::create([
            "user_id" => $user->id,
            "kode" => $request->kode,
        ]);

        return Dokter::with('user')->findOrFail($dokter->id);
    }

    public function update(Request $request, Dokter $dokter)
    {
        $validatedData = $request->validate([
            "kode" => ['required', 'max:255'],
            "nama" => ['required', 'max:255'],
            "email" => ['required', 'max:255', 'email', Rule::unique(User::class, "email")->ignore($dokter->user->id)],
        ]);

        if ($request->password) {
            $validatedData['password'] = bcrypt($request->password);
        }

        User::where('id', $dokter->user_id)->update(["nama" => $request->nama, "email" => $request->email]);

        $dokter->update([
            "kode" => $request->kode,
        ]);

        return Dokter::with('user')->findOrFail($dokter->id);
    }
}
