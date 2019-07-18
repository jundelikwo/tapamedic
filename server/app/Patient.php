<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $fillable = [
        'user_id',
        'address',
        'blood',
        'diseases',
        'date_of_birth',
        'drugs',
        'genotype',
        'occupation',
        'sex',
        'wallet',
    ];

    public function user()
    {
        return $this->belongsTo('App\User');
    }
}
