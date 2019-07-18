<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class LanguageMeta extends Model
{
    protected $fillable = [
        'user_id',
        'language_id',
    ];
}
