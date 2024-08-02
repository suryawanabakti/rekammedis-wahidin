<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RekamMedis extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    public function dokter()
    {
        return $this->belongsTo(User::class, 'dokter_id', 'id');
    }

    public function pasien()
    {
        return $this->belongsTo(Pasien::class);
    }

    public function diagnosa()
    {
        return $this->belongsTo(Diagnosa::class);
    }
}
