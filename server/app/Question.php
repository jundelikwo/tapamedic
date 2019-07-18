<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = [
        'asker_id',
        'answered',
        'num_answers',
        'language_id',
        'question',
        'slug',
    ];

    public function user()
    {
        return $this->belongsTo('App\User', 'asker_id');
    }

    public function answers()
    {
        return $this->hasMany('App\Answer');
    }
}
