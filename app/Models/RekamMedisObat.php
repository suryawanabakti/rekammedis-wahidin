<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RekamMedisObat extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    public function obat()
    {
        return $this->belongsTo(Obat::class);
    }

    public function rekamMedis()
    {
        return $this->belongsTo(RekamMedis::class);
    }
}
