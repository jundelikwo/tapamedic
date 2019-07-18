<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PaystackRef extends Model
{
    protected $fillable = [
        'consultation_id', 'ref'
    ];

    public function consultation()
    {
        return $this->belongsTo('App\Consultation');
    }
}
