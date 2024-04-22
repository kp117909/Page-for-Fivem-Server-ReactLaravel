<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OwnedVehicles extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $table = "owned_vehicles";

    protected $fillable = [
        'plate',
        'owner',
        'price',
        'model',
        'isdonator',
    ];
}
