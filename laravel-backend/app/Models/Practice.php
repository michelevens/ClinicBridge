<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Practice extends Model
{
    use Auditable, HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'npi',
        'tax_id',
        'specialty',
        'address',
        'city',
        'state',
        'zip',
        'phone',
        'fax',
        'email',
        'website',
        'logo_url',
        'operating_hours',
        'timezone',
        'subscription_tier',
        'max_providers',
        'max_patients',
        'settings',
    ];

    protected function casts(): array
    {
        return [
            'operating_hours' => 'array',
            'settings' => 'array',
        ];
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function providers(): HasMany
    {
        return $this->hasMany(User::class)->where('role', 'provider');
    }
}
