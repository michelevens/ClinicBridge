<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\AppointmentType;
use App\Models\ClinicalNote;
use App\Models\Patient;
use App\Models\Practice;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    private const PASSWORD = 'Demo1234!@#$';

    public function run(): void
    {
        // ── Practice ──
        $practice = Practice::create([
            'name' => 'Sunrise Behavioral Health',
            'slug' => 'sunrise-behavioral',
            'npi' => '1234567890',
            'specialty' => 'Behavioral Health',
            'address' => '100 Wellness Blvd',
            'city' => 'Orlando',
            'state' => 'FL',
            'zip' => '32801',
            'phone' => '(407) 555-0100',
            'email' => 'info@sunrisebehavioral.com',
            'timezone' => 'America/New_York',
            'subscription_tier' => 'practice',
            'max_providers' => 10,
            'max_patients' => 500,
            'operating_hours' => [
                'monday' => ['start' => '08:00', 'end' => '17:00'],
                'tuesday' => ['start' => '08:00', 'end' => '17:00'],
                'wednesday' => ['start' => '08:00', 'end' => '17:00'],
                'thursday' => ['start' => '08:00', 'end' => '17:00'],
                'friday' => ['start' => '08:00', 'end' => '15:00'],
                'saturday' => null,
                'sunday' => null,
            ],
            'settings' => [
                'appointment_reminders' => true,
                'telehealth_enabled' => true,
                'billing_enabled' => true,
            ],
        ]);

        // ── Users (one per role) ──
        $provider = User::create([
            'practice_id' => $practice->id,
            'email' => 'provider@demo.com',
            'password' => Hash::make(self::PASSWORD),
            'role' => 'provider',
            'first_name' => 'Sarah',
            'last_name' => 'Mitchell',
            'phone' => '(407) 555-0101',
            'email_verified_at' => now(),
            'onboarding_completed' => true,
        ]);

        $practiceAdmin = User::create([
            'practice_id' => $practice->id,
            'email' => 'admin@demo.com',
            'password' => Hash::make(self::PASSWORD),
            'role' => 'practice_admin',
            'first_name' => 'James',
            'last_name' => 'Rodriguez',
            'phone' => '(407) 555-0102',
            'email_verified_at' => now(),
            'onboarding_completed' => true,
        ]);

        $frontDesk = User::create([
            'practice_id' => $practice->id,
            'email' => 'frontdesk@demo.com',
            'password' => Hash::make(self::PASSWORD),
            'role' => 'front_desk',
            'first_name' => 'Maria',
            'last_name' => 'Santos',
            'phone' => '(407) 555-0103',
            'email_verified_at' => now(),
            'onboarding_completed' => true,
        ]);

        $biller = User::create([
            'practice_id' => $practice->id,
            'email' => 'biller@demo.com',
            'password' => Hash::make(self::PASSWORD),
            'role' => 'biller',
            'first_name' => 'David',
            'last_name' => 'Chen',
            'phone' => '(407) 555-0104',
            'email_verified_at' => now(),
            'onboarding_completed' => true,
        ]);

        $patientUser = User::create([
            'practice_id' => $practice->id,
            'email' => 'patient@demo.com',
            'password' => Hash::make(self::PASSWORD),
            'role' => 'patient',
            'first_name' => 'Emily',
            'last_name' => 'Johnson',
            'phone' => '(407) 555-0200',
            'email_verified_at' => now(),
            'onboarding_completed' => true,
        ]);

        $platformAdmin = User::create([
            'email' => 'superadmin@demo.com',
            'password' => Hash::make(self::PASSWORD),
            'role' => 'admin',
            'first_name' => 'Platform',
            'last_name' => 'Admin',
            'email_verified_at' => now(),
            'onboarding_completed' => true,
        ]);

        // ── Appointment Types ──
        $initialEval = AppointmentType::create([
            'practice_id' => $practice->id,
            'name' => 'Initial Evaluation',
            'duration_minutes' => 60,
            'color' => '#0c6b9a',
            'is_telehealth' => false,
            'is_default' => true,
            'allow_self_schedule' => true,
            'buffer_minutes' => 15,
            'max_per_day' => 4,
        ]);

        $followUp = AppointmentType::create([
            'practice_id' => $practice->id,
            'name' => 'Follow-Up Session',
            'duration_minutes' => 30,
            'color' => '#14b8a6',
            'is_telehealth' => false,
            'is_default' => false,
            'allow_self_schedule' => true,
            'buffer_minutes' => 10,
            'max_per_day' => 12,
        ]);

        $telehealthType = AppointmentType::create([
            'practice_id' => $practice->id,
            'name' => 'Telehealth Session',
            'duration_minutes' => 45,
            'color' => '#8b5cf6',
            'is_telehealth' => true,
            'is_default' => false,
            'allow_self_schedule' => true,
            'buffer_minutes' => 5,
            'max_per_day' => 8,
        ]);

        // ── Patients ──
        $patients = collect([
            ['first_name' => 'Emily', 'last_name' => 'Johnson', 'dob' => '1990-03-15', 'sex' => 'female', 'email' => 'emily.j@email.com', 'phone' => '(407) 555-0200', 'user_id' => $patientUser->id],
            ['first_name' => 'Michael', 'last_name' => 'Williams', 'dob' => '1985-07-22', 'sex' => 'male', 'email' => 'michael.w@email.com', 'phone' => '(407) 555-0201'],
            ['first_name' => 'Jessica', 'last_name' => 'Brown', 'dob' => '1978-11-08', 'sex' => 'female', 'email' => 'jessica.b@email.com', 'phone' => '(407) 555-0202'],
            ['first_name' => 'Daniel', 'last_name' => 'Garcia', 'dob' => '1995-01-30', 'sex' => 'male', 'email' => 'daniel.g@email.com', 'phone' => '(407) 555-0203'],
            ['first_name' => 'Ashley', 'last_name' => 'Martinez', 'dob' => '1988-06-12', 'sex' => 'female', 'email' => 'ashley.m@email.com', 'phone' => '(407) 555-0204'],
            ['first_name' => 'Christopher', 'last_name' => 'Davis', 'dob' => '1972-09-05', 'sex' => 'male', 'email' => 'chris.d@email.com', 'phone' => '(407) 555-0205'],
            ['first_name' => 'Samantha', 'last_name' => 'Taylor', 'dob' => '2001-04-18', 'sex' => 'female', 'email' => 'sam.t@email.com', 'phone' => '(407) 555-0206'],
            ['first_name' => 'Robert', 'last_name' => 'Anderson', 'dob' => '1968-12-25', 'sex' => 'male', 'email' => 'robert.a@email.com', 'phone' => '(407) 555-0207'],
        ])->map(function ($data, $index) use ($practice) {
            return Patient::create([
                'practice_id' => $practice->id,
                'user_id' => $data['user_id'] ?? null,
                'mrn' => sprintf('MRN-%06d', $index + 1),
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'date_of_birth' => $data['dob'],
                'sex' => $data['sex'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'address' => ($index + 100).' Main Street',
                'city' => 'Orlando',
                'state' => 'FL',
                'zip' => '3280'.($index + 1),
                'insurance_carrier' => ['Aetna', 'Blue Cross', 'Cigna', 'United Health'][$index % 4],
                'insurance_plan' => 'PPO Standard',
                'insurance_member_id' => 'INS'.str_pad((string) ($index + 1), 8, '0', STR_PAD_LEFT),
                'status' => 'active',
                'preferred_language' => 'English',
            ]);
        });

        // ── Appointments (past + today + upcoming) ──
        $today = Carbon::today();
        $statuses = ['completed', 'completed', 'completed', 'checked_in', 'confirmed', 'scheduled', 'scheduled'];
        $appointmentTypes = [$initialEval, $followUp, $followUp, $followUp, $telehealthType, $followUp, $initialEval];

        foreach ($statuses as $i => $status) {
            $date = $today->copy()->addDays($i - 3); // 3 days ago through 3 days ahead
            $hour = 9 + $i;
            $type = $appointmentTypes[$i];

            Appointment::create([
                'practice_id' => $practice->id,
                'patient_id' => $patients[$i]->id,
                'provider_id' => $provider->id,
                'appointment_type_id' => $type->id,
                'date' => $date,
                'start_time' => sprintf('%02d:00', $hour),
                'end_time' => sprintf('%02d:%02d', $hour, $type->duration_minutes),
                'status' => $status,
                'type' => $type->is_telehealth ? 'telehealth' : 'in_person',
                'reason' => ['Anxiety management', 'Depression follow-up', 'CBT session', 'Medication review', 'Couples therapy', 'Trauma processing', 'Initial intake'][$i],
                'created_by' => $status === 'scheduled' ? $frontDesk->id : $provider->id,
                'checked_in_at' => in_array($status, ['checked_in', 'completed']) ? $date->copy()->setHour($hour)->subMinutes(5) : null,
                'confirmed_at' => $status !== 'scheduled' ? $date->copy()->subDay() : null,
            ]);
        }

        // ── Clinical Notes (for completed appointments) ──
        $soapTemplates = [
            [
                'subjective' => 'Patient reports increased anxiety over the past week, difficulty sleeping, racing thoughts. States work stress has been a major trigger.',
                'objective' => 'Patient appears well-groomed but fidgety. Speech rate slightly elevated. Affect anxious. No suicidal or homicidal ideation.',
                'assessment' => 'Generalized Anxiety Disorder (F41.1) — moderate severity. Patient showing some improvement with current CBT techniques but sleep disturbance persists.',
                'plan' => 'Continue weekly CBT sessions. Introduce sleep hygiene psychoeducation. Consider referral to psychiatry for medication evaluation if no improvement in 2 weeks.',
            ],
            [
                'subjective' => 'Patient reports mood has been "a little better" this week. Engaged in social activity (dinner with friend) for first time in months. Still experiencing low energy.',
                'objective' => 'Patient dressed casually, good eye contact. Affect slightly brighter than last session. PHQ-9 score: 12 (moderate).',
                'assessment' => 'Major Depressive Disorder, recurrent, moderate (F33.1). Positive trajectory noted with behavioral activation.',
                'plan' => 'Continue behavioral activation exercises. Assign pleasure/mastery activity scheduling. Follow up PHQ-9 next session.',
            ],
            [
                'subjective' => 'Patient attended session with partner. Both report communication has improved since starting couples exercises. Conflict around household responsibilities persists.',
                'objective' => 'Both partners engaged and cooperative. Communication patterns show reduced blame language. Some defensive posturing when financial topics arise.',
                'assessment' => 'Relationship distress — improving. Communication skills developing well. Financial stress identified as new focus area.',
                'plan' => 'Introduce Gottman method for financial conversations. Assign "dreams within conflict" exercise. Next session: focus on financial planning communication.',
            ],
        ];

        for ($i = 0; $i < 3; $i++) {
            $noteDate = $today->copy()->subDays(3 - $i);
            ClinicalNote::create([
                'practice_id' => $practice->id,
                'patient_id' => $patients[$i]->id,
                'provider_id' => $provider->id,
                'appointment_id' => $i + 1,
                'template_type' => 'soap',
                'content' => json_encode($soapTemplates[$i]),
                'date_of_service' => $noteDate,
                'session_duration_minutes' => [60, 30, 45][$i],
                'diagnosis_codes' => [['F41.1'], ['F33.1'], ['Z63.0']][$i],
                'status' => $i < 2 ? 'signed' : 'draft',
                'signed_at' => $i < 2 ? $noteDate->copy()->addHour() : null,
                'signed_by' => $i < 2 ? $provider->id : null,
            ]);
        }

        $this->command->info('');
        $this->command->info('══════════════════════════════════════════');
        $this->command->info('  ClinicBridge Demo Accounts Created');
        $this->command->info('══════════════════════════════════════════');
        $this->command->info('  Password for all: '.self::PASSWORD);
        $this->command->info('');
        $this->command->table(
            ['Role', 'Email'],
            [
                ['Provider', 'provider@demo.com'],
                ['Practice Admin', 'admin@demo.com'],
                ['Front Desk', 'frontdesk@demo.com'],
                ['Biller', 'biller@demo.com'],
                ['Patient', 'patient@demo.com'],
                ['Platform Admin', 'superadmin@demo.com'],
            ]
        );
    }
}
