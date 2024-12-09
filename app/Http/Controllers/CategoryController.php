<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        if (auth()->user()->role == 'pasien') {
            return redirect('/dashboard');
        }
        return Inertia::render("Category", ["categorys" => Category::orderBy('created_at', 'desc')->get()]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nama' => ['required', 'max:255'],

        ]);
        return Category::create($validatedData);
    }

    public function update(Request $request, Category $category)
    {
        $validatedData = $request->validate([
            'nama' => ['required', 'max:255'],

        ]);
        $category->update($validatedData);
        return $category;
    }

    public function destroy(Category $category)
    {
        $category->delete();
    }
}
