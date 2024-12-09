<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Obat extends Model
{
    use HasFactory;
    protected $fillable = ['kode', 'nama', 'category_id', 'satuan_id'];

    public function satuan()
    {
        return $this->belongsTo(Satuan::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
