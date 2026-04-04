<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BibleVerse extends Model
{
    protected $table = 'bible_verses';
    protected $fillable = [
        'reference',
        'content',
        'embedding',
    ];
}
