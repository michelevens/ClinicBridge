<?php

namespace App\Traits;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

trait Auditable
{
    public static function bootAuditable(): void
    {
        foreach (['created', 'updated', 'deleted'] as $event) {
            static::$event(function ($model) use ($event): void {
                $user = Auth::user();
                if (! $user) {
                    return;
                }

                $changes = $model->getChanges();
                $original = $model->getOriginal();

                $changedFields = array_keys($changes);
                $oldValues = [];
                $newValues = [];

                foreach ($changedFields as $field) {
                    if (in_array($field, ['updated_at', 'created_at', 'password', 'remember_token'], true)) {
                        continue;
                    }
                    $oldValues[$field] = $original[$field] ?? null;
                    $newValues[$field] = $changes[$field] ?? null;
                }

                if ($event !== 'created' && empty($oldValues)) {
                    return;
                }

                \DB::table('audit_logs')->insert([
                    'practice_id' => $user->practice_id,
                    'user_id' => $user->id,
                    'action' => $event,
                    'resource_type' => $model->getMorphClass(),
                    'resource_id' => $model->getKey(),
                    'resource_name' => $model->audit_name ?? null,
                    'old_values' => json_encode($oldValues),
                    'new_values' => json_encode($newValues),
                    'changed_fields' => json_encode(array_keys($oldValues)),
                    'ip_address' => Request::ip(),
                    'user_agent' => Request::userAgent(),
                    'risk_level' => 'low',
                    'created_at' => now(),
                ]);
            });
        }
    }
}
