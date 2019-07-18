<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'consultation_id',
        'user_id',
        'type',
        'message',
        'image',
        'thumb',
    ];

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function consultation()
    {
        return $this->belongsTo('App\Consultation');
    }
}
