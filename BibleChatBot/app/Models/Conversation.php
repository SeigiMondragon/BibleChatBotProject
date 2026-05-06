<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Conversation extends Model
{   use Searchable;
    protected $fillable = [
        "name",
        "user_id"
    ];

    public function toSearchableArray(){
        return [
            "name" => $this->name
        ];
    }

    public function messages(){
        return $this->hasMany(Message::class);
    }
}
