<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GasStationBusiness extends Model
{
    use HasFactory;
    protected $table = "gas_station_business";
    public $timestamps = false;
    protected $fillable = [
        'couser_id',
    ];
}
