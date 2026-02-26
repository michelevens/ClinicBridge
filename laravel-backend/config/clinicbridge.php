<?php

return [
    /*
    |--------------------------------------------------------------------------
    | ClinicBridge Application Config
    |--------------------------------------------------------------------------
    */

    'name' => env('APP_NAME', 'ClinicBridge'),

    'roles' => [
        'provider',
        'patient',
        'front_desk',
        'biller',
        'practice_admin',
        'admin',
    ],

    'subscription_tiers' => [
        'free' => [
            'max_providers' => 1,
            'max_patients' => 25,
            'telehealth' => false,
            'billing' => false,
        ],
        'practice' => [
            'max_providers' => 5,
            'max_patients' => null,
            'telehealth' => true,
            'billing' => true,
        ],
        'group' => [
            'max_providers' => null,
            'max_patients' => null,
            'telehealth' => true,
            'billing' => true,
        ],
        'enterprise' => [
            'max_providers' => null,
            'max_patients' => null,
            'telehealth' => true,
            'billing' => true,
        ],
    ],

    'session' => [
        'timeout_minutes' => env('SESSION_TIMEOUT', 15),
        'max_failed_attempts' => 5,
        'lockout_minutes' => 30,
    ],

    'password' => [
        'min_length' => 12,
    ],

    'billing' => [
        'per_video_visit' => 0.50,
        'per_claim' => 0.25,
    ],
];
