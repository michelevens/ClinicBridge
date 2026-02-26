<?php

namespace App\Models;

use App\Traits\BelongsToPractice;
use Illuminate\Database\Eloquent\Model;

class AppointmentType extends Model
{
    use BelongsToPractice;

    protected $fillable = [
        'practice_id',
        'name',
        'duration_minutes',
        'color',
        'is_telehealth',
        'is_default',
        'allow_self_schedule',
        'buffer_minutes',
        'max_per_day',
    ];

    protected function casts(): array
    {
        return [
            'is_telehealth' => 'boolean',
            'is_default' => 'boolean',
            'allow_self_schedule' => 'boolean',
        ];
    }
}
