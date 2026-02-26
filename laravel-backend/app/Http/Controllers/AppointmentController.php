<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\AppointmentType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Appointment::with(['patient:id,first_name,last_name,mrn', 'provider:id,first_name,last_name', 'appointmentType:id,name,color,duration_minutes']);

        if ($date = $request->get('date')) {
            $query->whereDate('date', $date);
        }

        if ($startDate = $request->get('start_date')) {
            $query->whereDate('date', '>=', $startDate);
        }

        if ($endDate = $request->get('end_date')) {
            $query->whereDate('date', '<=', $endDate);
        }

        if ($providerId = $request->get('provider_id')) {
            $query->where('provider_id', $providerId);
        }

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        if ($patientId = $request->get('patient_id')) {
            $query->where('patient_id', $patientId);
        }

        $appointments = $query->orderBy('date')->orderBy('start_time')->get();

        return response()->json($appointments);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'patient_id' => ['required', 'exists:patients,id'],
            'provider_id' => ['required', 'exists:users,id'],
            'appointment_type_id' => ['required', 'exists:appointment_types,id'],
            'date' => ['required', 'date', 'after_or_equal:today'],
            'start_time' => ['required', 'date_format:H:i'],
            'type' => ['required', 'in:in_person,telehealth'],
            'reason' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'copay_amount' => ['nullable', 'numeric', 'min:0'],
        ]);

        $appointmentType = AppointmentType::findOrFail($validated['appointment_type_id']);

        $startTime = \Carbon\Carbon::createFromFormat('H:i', $validated['start_time']);
        $endTime = $startTime->copy()->addMinutes($appointmentType->duration_minutes);

        $validated['end_time'] = $endTime->format('H:i');
        $validated['created_by'] = $request->user()->id;

        $appointment = Appointment::create($validated);
        $appointment->load(['patient:id,first_name,last_name,mrn', 'provider:id,first_name,last_name', 'appointmentType:id,name,color']);

        return response()->json($appointment, 201);
    }

    public function show(Appointment $appointment): JsonResponse
    {
        $appointment->load(['patient', 'provider:id,first_name,last_name,email', 'appointmentType']);

        return response()->json($appointment);
    }

    public function update(Request $request, Appointment $appointment): JsonResponse
    {
        $validated = $request->validate([
            'date' => ['sometimes', 'date'],
            'start_time' => ['sometimes', 'date_format:H:i'],
            'status' => ['sometimes', 'in:scheduled,confirmed,checked_in,in_progress,completed,cancelled,no_show'],
            'reason' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'cancellation_reason' => ['nullable', 'string'],
            'copay_amount' => ['nullable', 'numeric', 'min:0'],
            'copay_collected' => ['sometimes', 'boolean'],
        ]);

        if (isset($validated['status']) && $validated['status'] === 'checked_in') {
            $validated['checked_in_at'] = now();
        }

        if (isset($validated['status']) && $validated['status'] === 'confirmed') {
            $validated['confirmed_at'] = now();
        }

        $appointment->update($validated);

        return response()->json($appointment);
    }

    public function destroy(Appointment $appointment): JsonResponse
    {
        $appointment->update(['status' => 'cancelled']);
        $appointment->delete();

        return response()->json(['message' => 'Appointment cancelled.']);
    }

    public function checkIn(Appointment $appointment): JsonResponse
    {
        $appointment->update([
            'status' => 'checked_in',
            'checked_in_at' => now(),
        ]);

        return response()->json($appointment);
    }

    public function complete(Appointment $appointment): JsonResponse
    {
        $appointment->update(['status' => 'completed']);

        $appointment->patient->update([
            'last_visit_at' => now(),
            'total_visits' => $appointment->patient->total_visits + 1,
        ]);

        return response()->json($appointment);
    }
}
