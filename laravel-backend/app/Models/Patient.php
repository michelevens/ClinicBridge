<?php

namespace App\Models;

use App\Traits\Auditable;
use App\Traits\BelongsToPractice;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Patient extends Model
{
    use Auditable, BelongsToPractice, HasFactory, SoftDeletes;

    protected $fillable = [
        'practice_id',
        'user_id',
        'mrn',
        'first_name',
        'last_name',
        'date_of_birth',
        'sex',
        'email',
        'phone',
        'address',
        'city',
        'state',
        'zip',
        'ssn',
        'insurance_carrier',
        'insurance_plan',
        'insurance_member_id',
        'insurance_group_id',
        'insurance_verified_at',
        'secondary_insurance_carrier',
        'secondary_member_id',
        'emergency_contact_name',
        'emergency_contact_phone',
        'emergency_contact_relationship',
        'allergies',
        'preferred_language',
        'preferred_pharmacy',
        'notes',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'allergies' => 'array',
            'ssn' => 'encrypted',
            'insurance_verified_at' => 'datetime',
            'last_visit_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getAuditNameAttribute(): string
    {
        return $this->first_name.' '.$this->last_name;
    }

    public function getFullNameAttribute(): string
    {
        return $this->first_name.' '.$this->last_name;
    }

    public static function generateMrn(int $practiceId): string
    {
        $count = self::withoutGlobalScopes()
            ->where('practice_id', $practiceId)
            ->count();

        return sprintf('MRN-%06d', $count + 1);
    }
}
