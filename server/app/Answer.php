<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    protected $fillable = [
        'answer',
        'doctor_id',
        'question_id',
    ];

    public function user()
    {
        return $this->belongsTo('App\User', 'doctor_id');
    }

    public function question()
    {
        return $this->belongsTo('App\Question');
    }
}
