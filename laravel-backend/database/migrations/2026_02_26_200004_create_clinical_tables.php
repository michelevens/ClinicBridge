<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clinical_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('practice_id')->constrained()->cascadeOnDelete();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->foreignId('provider_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('appointment_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('template_type', ['soap', 'dap', 'birp', 'free_text'])->default('soap');
            $table->text('content'); // encrypted JSON
            $table->date('date_of_service');
            $table->integer('session_duration_minutes')->nullable();
            $table->json('diagnosis_codes')->nullable();
            $table->enum('status', ['draft', 'completed', 'signed', 'amended'])->default('draft');
            $table->timestamp('signed_at')->nullable();
            $table->foreignId('signed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('amendment_reason')->nullable();
            $table->timestamp('amended_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['practice_id', 'patient_id']);
            $table->index(['practice_id', 'provider_id', 'date_of_service']);
        });

        Schema::create('problems', function (Blueprint $table) {
            $table->id();
            $table->foreignId('practice_id')->constrained()->cascadeOnDelete();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->string('icd10_code')->nullable();
            $table->string('description');
            $table->date('onset_date')->nullable();
            $table->enum('status', ['active', 'resolved', 'chronic'])->default('active');
            $table->foreignId('noted_by')->constrained('users')->cascadeOnDelete();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });

        Schema::create('medications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('practice_id')->constrained()->cascadeOnDelete();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('dosage')->nullable();
            $table->string('route')->nullable();
            $table->string('frequency')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->foreignId('prescribed_by')->constrained('users')->cascadeOnDelete();
            $table->enum('status', ['active', 'discontinued', 'completed'])->default('active');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('allergies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('practice_id')->constrained()->cascadeOnDelete();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->string('allergen');
            $table->string('reaction')->nullable();
            $table->enum('severity', ['mild', 'moderate', 'severe', 'life_threatening'])->default('moderate');
            $table->date('onset_date')->nullable();
            $table->foreignId('noted_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('vitals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('practice_id')->constrained()->cascadeOnDelete();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->foreignId('appointment_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('recorded_by')->constrained('users')->cascadeOnDelete();
            $table->decimal('weight_lbs', 6, 1)->nullable();
            $table->decimal('height_inches', 5, 1)->nullable();
            $table->decimal('bmi', 5, 1)->nullable();
            $table->integer('bp_systolic')->nullable();
            $table->integer('bp_diastolic')->nullable();
            $table->integer('heart_rate')->nullable();
            $table->decimal('temperature_f', 5, 1)->nullable();
            $table->integer('spo2')->nullable();
            $table->integer('respiratory_rate')->nullable();
            $table->integer('pain_level')->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('recorded_at');
            $table->timestamps();

            $table->index(['practice_id', 'patient_id', 'recorded_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vitals');
        Schema::dropIfExists('allergies');
        Schema::dropIfExists('medications');
        Schema::dropIfExists('problems');
        Schema::dropIfExists('clinical_notes');
    }
};
