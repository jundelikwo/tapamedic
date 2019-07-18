<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    protected $fillable = [
        'user_id',
        'approved',
        'review',
        'graduation_year',
        'bank_name',
        'account_name',
        'account_number',
        'mdcn_folio',
        'mdcn_membership',
        'specialty',
        'university',
        'location',
        'total_earnings',
        'wallet',
    ];

    public function user()
    {
        return $this->belongsTo('App\User');
    }
}
