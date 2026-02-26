<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Patient::query();

        if ($search = $request->get('search')) {
            $search = '%'.str_replace(['%', '_'], ['\%', '\_'], $search).'%';
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'ilike', $search)
                    ->orWhere('last_name', 'ilike', $search)
                    ->orWhere('email', 'ilike', $search)
                    ->orWhere('mrn', 'ilike', $search)
                    ->orWhere('phone', 'ilike', $search);
            });
        }

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        $sortField = $request->get('sort', 'last_name');
        $sortDir = $request->get('direction', 'asc');
        $allowedSorts = ['first_name', 'last_name', 'date_of_birth', 'created_at', 'last_visit_at'];
        if (in_array($sortField, $allowedSorts, true)) {
            $query->orderBy($sortField, $sortDir === 'desc' ? 'desc' : 'asc');
        }

        $patients = $query->paginate($request->get('per_page', 25));

        return response()->json($patients);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'date_of_birth' => ['required', 'date', 'before:today'],
            'sex' => ['required', 'in:male,female,other'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'state' => ['nullable', 'string', 'max:2'],
            'zip' => ['nullable', 'string', 'max:10'],
            'ssn' => ['nullable', 'string'],
            'insurance_carrier' => ['nullable', 'string', 'max:255'],
            'insurance_plan' => ['nullable', 'string', 'max:255'],
            'insurance_member_id' => ['nullable', 'string', 'max:255'],
            'insurance_group_id' => ['nullable', 'string', 'max:255'],
            'emergency_contact_name' => ['nullable', 'string', 'max:255'],
            'emergency_contact_phone' => ['nullable', 'string', 'max:20'],
            'emergency_contact_relationship' => ['nullable', 'string', 'max:255'],
            'allergies' => ['nullable', 'array'],
            'preferred_language' => ['nullable', 'string', 'max:50'],
            'preferred_pharmacy' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ]);

        $validated['mrn'] = Patient::generateMrn($request->user()->practice_id);

        $patient = Patient::create($validated);

        return response()->json($patient, 201);
    }

    public function show(Patient $patient): JsonResponse
    {
        return response()->json($patient);
    }

    public function update(Request $request, Patient $patient): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => ['sometimes', 'string', 'max:255'],
            'last_name' => ['sometimes', 'string', 'max:255'],
            'date_of_birth' => ['sometimes', 'date', 'before:today'],
            'sex' => ['sometimes', 'in:male,female,other'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'state' => ['nullable', 'string', 'max:2'],
            'zip' => ['nullable', 'string', 'max:10'],
            'ssn' => ['nullable', 'string'],
            'insurance_carrier' => ['nullable', 'string', 'max:255'],
            'insurance_plan' => ['nullable', 'string', 'max:255'],
            'insurance_member_id' => ['nullable', 'string', 'max:255'],
            'insurance_group_id' => ['nullable', 'string', 'max:255'],
            'emergency_contact_name' => ['nullable', 'string', 'max:255'],
            'emergency_contact_phone' => ['nullable', 'string', 'max:20'],
            'emergency_contact_relationship' => ['nullable', 'string', 'max:255'],
            'allergies' => ['nullable', 'array'],
            'preferred_language' => ['nullable', 'string', 'max:50'],
            'preferred_pharmacy' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
            'status' => ['sometimes', 'in:active,inactive,deceased'],
        ]);

        $patient->update($validated);

        return response()->json($patient);
    }

    public function destroy(Patient $patient): JsonResponse
    {
        $patient->delete();

        return response()->json(['message' => 'Patient archived.']);
    }
}
