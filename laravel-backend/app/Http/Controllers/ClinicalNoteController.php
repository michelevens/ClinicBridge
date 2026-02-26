<?php

namespace App\Http\Controllers;

use App\Models\ClinicalNote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClinicalNoteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ClinicalNote::with(['patient:id,first_name,last_name,mrn', 'provider:id,first_name,last_name']);

        if ($patientId = $request->get('patient_id')) {
            $query->where('patient_id', $patientId);
        }

        if ($providerId = $request->get('provider_id')) {
            $query->where('provider_id', $providerId);
        }

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        if ($templateType = $request->get('template_type')) {
            $query->where('template_type', $templateType);
        }

        $notes = $query->orderByDesc('date_of_service')->paginate($request->get('per_page', 25));

        return response()->json($notes);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'patient_id' => ['required', 'exists:patients,id'],
            'appointment_id' => ['nullable', 'exists:appointments,id'],
            'template_type' => ['required', 'in:soap,dap,birp,free_text'],
            'content' => ['required', 'string'],
            'date_of_service' => ['required', 'date'],
            'session_duration_minutes' => ['nullable', 'integer', 'min:1'],
            'diagnosis_codes' => ['nullable', 'array'],
        ]);

        $validated['provider_id'] = $request->user()->id;

        $note = ClinicalNote::create($validated);
        $note->load(['patient:id,first_name,last_name', 'provider:id,first_name,last_name']);

        return response()->json($note, 201);
    }

    public function show(ClinicalNote $note): JsonResponse
    {
        // Log PHI access
        \DB::table('audit_logs')->insert([
            'practice_id' => $note->practice_id,
            'user_id' => auth()->id(),
            'action' => 'viewed',
            'resource_type' => 'ClinicalNote',
            'resource_id' => $note->id,
            'resource_name' => $note->audit_name,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'phi_category' => 'clinical_note',
            'risk_level' => 'medium',
            'created_at' => now(),
        ]);

        $note->load(['patient', 'provider:id,first_name,last_name,email', 'appointment']);

        return response()->json($note);
    }

    public function update(Request $request, ClinicalNote $note): JsonResponse
    {
        if ($note->status === 'signed') {
            return response()->json(['message' => 'Cannot edit a signed note. Use amend instead.'], 422);
        }

        $validated = $request->validate([
            'content' => ['sometimes', 'string'],
            'template_type' => ['sometimes', 'in:soap,dap,birp,free_text'],
            'session_duration_minutes' => ['nullable', 'integer', 'min:1'],
            'diagnosis_codes' => ['nullable', 'array'],
        ]);

        $note->update($validated);

        return response()->json($note);
    }

    public function sign(ClinicalNote $note): JsonResponse
    {
        if ($note->status === 'signed') {
            return response()->json(['message' => 'Note is already signed.'], 422);
        }

        $note->update([
            'status' => 'signed',
            'signed_at' => now(),
            'signed_by' => auth()->id(),
        ]);

        return response()->json($note);
    }

    public function amend(Request $request, ClinicalNote $note): JsonResponse
    {
        if ($note->status !== 'signed') {
            return response()->json(['message' => 'Only signed notes can be amended.'], 422);
        }

        $validated = $request->validate([
            'content' => ['required', 'string'],
            'amendment_reason' => ['required', 'string'],
        ]);

        $note->update([
            'content' => $validated['content'],
            'amendment_reason' => $validated['amendment_reason'],
            'amended_at' => now(),
            'status' => 'amended',
        ]);

        return response()->json($note);
    }
}
