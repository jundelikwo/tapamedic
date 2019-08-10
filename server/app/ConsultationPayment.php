<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ConsultationPayment extends Model
{
    protected $fillable = [
        'consultation_id',
        'doctor_cut',
        'tapamedic_cut',
        'year',
        'month',
        'day',
    ];
}
