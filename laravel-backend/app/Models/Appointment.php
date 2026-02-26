<?php

namespace App\Models;

use App\Traits\Auditable;
use App\Traits\BelongsToPractice;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Appointment extends Model
{
    use Auditable, BelongsToPractice, SoftDeletes;

    protected $fillable = [
        'practice_id',
        'patient_id',
        'provider_id',
        'appointment_type_id',
        'date',
        'start_time',
        'end_time',
        'status',
        'type',
        'telehealth_room_id',
        'telehealth_link',
        'reason',
        'notes',
        'cancellation_reason',
        'copay_amount',
        'copay_collected',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'copay_amount' => 'decimal:2',
            'copay_collected' => 'boolean',
            'reminder_sent_at' => 'datetime',
            'confirmed_at' => 'datetime',
            'checked_in_at' => 'datetime',
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

    public function appointmentType(): BelongsTo
    {
        return $this->belongsTo(AppointmentType::class);
    }

    public function getAuditNameAttribute(): string
    {
        return $this->date->format('Y-m-d').' '.$this->start_time;
    }
}
