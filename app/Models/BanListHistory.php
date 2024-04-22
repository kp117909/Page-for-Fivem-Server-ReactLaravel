<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BanListHistory extends Model
{
    use HasFactory;

    protected $table = "banlisthistory";
    public $timestamps = false;
    protected $fillable = [
        'identifier',
        'license',
        'liveid',
        'xblid',
        'discord',
        'playerip',
        'targetplayername',
        'sourceplayername',
        'reason',
        'timeat',
        'expiration',
        'permanent',
        'token',
    ];
}
