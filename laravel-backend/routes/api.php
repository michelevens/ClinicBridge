<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClinicalNoteController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PracticeController;
use Illuminate\Support\Facades\Route;

// Health check
Route::get('/health', fn () => response()->json(['status' => 'ok', 'timestamp' => now()]));

// Auth routes (public)
Route::prefix('auth')->group(function (): void {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
});

// Authenticated routes
Route::middleware('auth:sanctum')->group(function (): void {
    // Auth
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Practice (requires practice membership)
    Route::middleware('practice')->group(function (): void {
        Route::get('/practice', [PracticeController::class, 'show']);
        Route::put('/practice', [PracticeController::class, 'update']);
        Route::get('/practice/staff', [PracticeController::class, 'staff']);

        // Patients
        Route::apiResource('patients', PatientController::class);

        // Appointments
        Route::apiResource('appointments', AppointmentController::class);
        Route::post('/appointments/{appointment}/check-in', [AppointmentController::class, 'checkIn']);
        Route::post('/appointments/{appointment}/complete', [AppointmentController::class, 'complete']);

        // Appointment Types
        Route::apiResource('appointment-types', \App\Http\Controllers\AppointmentTypeController::class);

        // Clinical Notes
        Route::apiResource('notes', ClinicalNoteController::class)->except(['destroy']);
        Route::post('/notes/{note}/sign', [ClinicalNoteController::class, 'sign']);
        Route::post('/notes/{note}/amend', [ClinicalNoteController::class, 'amend']);

        // Practice admin only
        Route::middleware('role:practice_admin,admin')->group(function (): void {
            Route::post('/practice/invite', [PracticeController::class, 'invite']);
            Route::get('/practice/invites', [PracticeController::class, 'invites']);
            Route::delete('/practice/invites/{invite}', [PracticeController::class, 'revokeInvite']);
            Route::put('/practice/staff/{user}/role', [PracticeController::class, 'updateStaffRole']);
            Route::delete('/practice/staff/{user}', [PracticeController::class, 'removeStaff']);
        });
    });
});
