<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('practice_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('mrn')->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->date('date_of_birth');
            $table->enum('sex', ['male', 'female', 'other']);
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state', 2)->nullable();
            $table->string('zip', 10)->nullable();
            $table->text('ssn')->nullable(); // encrypted
            $table->string('insurance_carrier')->nullable();
            $table->string('insurance_plan')->nullable();
            $table->string('insurance_member_id')->nullable();
            $table->string('insurance_group_id')->nullable();
            $table->timestamp('insurance_verified_at')->nullable();
            $table->string('secondary_insurance_carrier')->nullable();
            $table->string('secondary_member_id')->nullable();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->string('emergency_contact_relationship')->nullable();
            $table->json('allergies')->nullable();
            $table->string('preferred_language')->nullable();
            $table->string('preferred_pharmacy')->nullable();
            $table->text('notes')->nullable();
            $table->enum('status', ['active', 'inactive', 'deceased'])->default('active');
            $table->timestamp('last_visit_at')->nullable();
            $table->integer('total_visits')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['practice_id', 'last_name', 'first_name']);
            $table->index(['practice_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
