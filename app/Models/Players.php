<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Players extends Model
{
    use HasFactory;
    protected $table = "users";
    public $timestamps = false;
    protected $fillable = [
        'identifier',
        'special_id',
        'license',
        'money',
        'accounts',
        'name',
        'skin',
        'job',
        'job_grade',
        'job2',
        'job2_grade',
        'job3',
        'job3_grade',
        'inventory',
        'position',
        'bank',
        'permission_level',
        'group',
        'jail',
        'last_property',
        'firstname',
        'lastname',
        'dateofbirth',
        'sex',
        'height',
        'opaska',
        'status',
        'phone_number',
        'tattoos',
        'is_dead',
        'question_rp',
        'kursy',
        'odznaka',
        'odznakaa',
        'skrzynki',
        'hp',
        'armor',
        'hotbar',
        'pincode',
        'iban',
        'reports',
        'animacje',
        'stylchodzenia',
        'wyraztwarzy',
        'bontelefon',
        'skill',
        'time',
        'usingpromocode',
        'apps',
        'widget',
        'bt',
        'charinfo',
        'metadata',
        'cryptocurrency',
        'cryptocurrencytransfers',
        'phonePos',
        'spotify',
        'ringtone',
        'first_screen_showed',
        'mdt_picture',
        'mdt_searched',
        'secondgroup',
        'thirdgroup',
        'propertylevel',
    ];

}
