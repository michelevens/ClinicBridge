<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointment_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('practice_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->integer('duration_minutes')->default(30);
            $table->string('color', 7)->default('#0c6b9a');
            $table->boolean('is_telehealth')->default(false);
            $table->boolean('is_default')->default(false);
            $table->boolean('allow_self_schedule')->default(false);
            $table->integer('buffer_minutes')->default(0);
            $table->integer('max_per_day')->nullable();
            $table->timestamps();
        });

        Schema::create('provider_availability', function (Blueprint $table) {
            $table->id();
            $table->foreignId('practice_id')->constrained()->cascadeOnDelete();
            $table->foreignId('provider_id')->constrained('users')->cascadeOnDelete();
            $table->tinyInteger('day_of_week'); // 0=Sunday, 6=Saturday
            $table->time('start_time');
            $table->time('end_time');
            $table->boolean('is_available')->default(true);
            $table->timestamps();

            $table->index(['provider_id', 'day_of_week']);
        });

        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('practice_id')->constrained()->cascadeOnDelete();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->foreignId('provider_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('appointment_type_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time');
            $table->enum('status', [
                'scheduled', 'confirmed', 'checked_in', 'in_progress',
                'completed', 'cancelled', 'no_show',
            ])->default('scheduled');
            $table->enum('type', ['in_person', 'telehealth'])->default('in_person');
            $table->string('telehealth_room_id')->nullable();
            $table->string('telehealth_link')->nullable();
            $table->text('reason')->nullable();
            $table->text('notes')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->timestamp('reminder_sent_at')->nullable();
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('checked_in_at')->nullable();
            $table->decimal('copay_amount', 8, 2)->nullable();
            $table->boolean('copay_collected')->default(false);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['practice_id', 'date', 'provider_id']);
            $table->index(['practice_id', 'patient_id']);
            $table->index(['practice_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
        Schema::dropIfExists('provider_availability');
        Schema::dropIfExists('appointment_types');
    }
};
