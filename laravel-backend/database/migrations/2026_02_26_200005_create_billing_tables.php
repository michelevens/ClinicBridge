<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('charges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('practice_id')->constrained()->cascadeOnDelete();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->foreignId('provider_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('appointment_id')->nullable()->constrained()->nullOnDelete();
            $table->string('cpt_code');
            $table->string('cpt_description');
            $table->json('diagnosis_codes')->nullable();
            $table->decimal('amount', 10, 2);
            $table->enum('status', ['draft', 'submitted', 'approved', 'billed'])->default('draft');
            $table->date('service_date');
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            $table->index(['practice_id', 'status']);
            $table->index(['practice_id', 'patient_id']);
        });

        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->enum('tier', ['free', 'practice', 'group', 'enterprise']);
            $table->decimal('price_per_provider_monthly', 8, 2)->default(0);
            $table->decimal('price_per_provider_yearly', 8, 2)->default(0);
            $table->integer('max_providers')->nullable();
            $table->integer('max_patients')->nullable();
            $table->json('features')->nullable();
            $table->string('stripe_monthly_price_id')->nullable();
            $table->string('stripe_yearly_price_id')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscription_plans');
        Schema::dropIfExists('charges');
    }
};
