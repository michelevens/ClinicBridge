<?php

namespace App\Http\Controllers;

use App\Models\AppointmentType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppointmentTypeController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(AppointmentType::orderBy('name')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'duration_minutes' => ['required', 'integer', 'min:5', 'max:480'],
            'color' => ['required', 'string', 'max:7'],
            'is_telehealth' => ['boolean'],
            'is_default' => ['boolean'],
            'allow_self_schedule' => ['boolean'],
            'buffer_minutes' => ['integer', 'min:0'],
            'max_per_day' => ['nullable', 'integer', 'min:1'],
        ]);

        return response()->json(AppointmentType::create($validated), 201);
    }

    public function show(AppointmentType $appointmentType): JsonResponse
    {
        return response()->json($appointmentType);
    }

    public function update(Request $request, AppointmentType $appointmentType): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'duration_minutes' => ['sometimes', 'integer', 'min:5', 'max:480'],
            'color' => ['sometimes', 'string', 'max:7'],
            'is_telehealth' => ['boolean'],
            'is_default' => ['boolean'],
            'allow_self_schedule' => ['boolean'],
            'buffer_minutes' => ['integer', 'min:0'],
            'max_per_day' => ['nullable', 'integer', 'min:1'],
        ]);

        $appointmentType->update($validated);

        return response()->json($appointmentType);
    }

    public function destroy(AppointmentType $appointmentType): JsonResponse
    {
        $appointmentType->delete();

        return response()->json(['message' => 'Appointment type deleted.']);
    }
}
