<?php

namespace App\Traits;

use App\Models\Practice;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

trait BelongsToPractice
{
    public static function bootBelongsToPractice(): void
    {
        static::addGlobalScope('practice', function (Builder $builder): void {
            $user = Auth::user();
            if ($user && $user->practice_id && $user->role !== 'admin') {
                $builder->where($builder->getModel()->getTable().'.practice_id', $user->practice_id);
            }
        });

        static::creating(function ($model): void {
            $user = Auth::user();
            if ($user && $user->practice_id && ! $model->practice_id) {
                $model->practice_id = $user->practice_id;
            }
        });
    }

    public function practice(): BelongsTo
    {
        return $this->belongsTo(Practice::class);
    }
}
