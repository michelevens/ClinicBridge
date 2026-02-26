<?php

namespace App\Models;

use App\Traits\Auditable;
use App\Traits\BelongsToPractice;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClinicalNote extends Model
{
    use Auditable, BelongsToPractice, SoftDeletes;

    protected $fillable = [
        'practice_id',
        'patient_id',
        'provider_id',
        'appointment_id',
        'template_type',
        'content',
        'date_of_service',
        'session_duration_minutes',
        'diagnosis_codes',
        'status',
        'signed_at',
        'signed_by',
        'amendment_reason',
        'amended_at',
    ];

    protected function casts(): array
    {
        return [
            'content' => 'encrypted',
            'diagnosis_codes' => 'array',
            'date_of_service' => 'date',
            'signed_at' => 'datetime',
            'amended_at' => 'datetime',
        ];
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(User::class, 'provider_id');
    }

    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class);
    }

    public function signer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'signed_by');
    }

    public function getAuditNameAttribute(): string
    {
        return $this->template_type.' note - '.$this->date_of_service->format('Y-m-d');
    }
}
