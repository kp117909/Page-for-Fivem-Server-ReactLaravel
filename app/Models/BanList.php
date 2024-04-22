<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BanList extends Model
{
    use HasFactory;

    protected $table = "banlist";
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
