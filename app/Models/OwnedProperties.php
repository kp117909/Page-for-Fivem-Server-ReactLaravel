<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OwnedProperties extends Model
{
    use HasFactory;
    public $timestamps = false;

    protected $table = "owned_properties";

    protected $fillable = [
        'shared',
    ];
}
