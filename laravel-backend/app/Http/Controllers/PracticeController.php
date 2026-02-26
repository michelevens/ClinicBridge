<?php

namespace App\Http\Controllers;

use App\Models\PracticeInvite;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PracticeController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        return response()->json($request->user()->practice);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'npi' => ['nullable', 'string', 'max:20'],
            'tax_id' => ['nullable', 'string', 'max:20'],
            'specialty' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'state' => ['nullable', 'string', 'max:2'],
            'zip' => ['nullable', 'string', 'max:10'],
            'phone' => ['nullable', 'string', 'max:20'],
            'fax' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:255'],
            'website' => ['nullable', 'url', 'max:255'],
            'timezone' => ['nullable', 'string', 'max:50'],
            'operating_hours' => ['nullable', 'array'],
        ]);

        $practice = $request->user()->practice;
        $practice->update($validated);

        return response()->json($practice);
    }

    public function invite(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'role' => ['required', 'in:provider,front_desk,biller,practice_admin'],
        ]);

        $practice = $request->user()->practice;

        $invite = PracticeInvite::create([
            'practice_id' => $practice->id,
            'email' => $validated['email'],
            'role' => $validated['role'],
            'token' => Str::random(64),
            'invited_by' => $request->user()->id,
            'expires_at' => now()->addDays(7),
        ]);

        // TODO: Send invite email via Resend

        return response()->json($invite, 201);
    }

    public function invites(Request $request): JsonResponse
    {
        $invites = PracticeInvite::where('accepted_at', null)
            ->where('expires_at', '>', now())
            ->with('inviter:id,first_name,last_name')
            ->get();

        return response()->json($invites);
    }

    public function revokeInvite(PracticeInvite $invite): JsonResponse
    {
        $invite->delete();

        return response()->json(['message' => 'Invite revoked.']);
    }

    public function staff(Request $request): JsonResponse
    {
        $staff = User::where('practice_id', $request->user()->practice_id)
            ->where('role', '!=', 'patient')
            ->select('id', 'first_name', 'last_name', 'email', 'role', 'last_login_at', 'created_at')
            ->get();

        return response()->json($staff);
    }

    public function updateStaffRole(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'role' => ['required', 'in:provider,front_desk,biller,practice_admin'],
        ]);

        if ($user->practice_id !== $request->user()->practice_id) {
            return response()->json(['message' => 'User not in your practice.'], 403);
        }

        $user->update(['role' => $validated['role']]);

        return response()->json($user);
    }

    public function removeStaff(Request $request, User $user): JsonResponse
    {
        if ($user->practice_id !== $request->user()->practice_id) {
            return response()->json(['message' => 'User not in your practice.'], 403);
        }

        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Cannot remove yourself.'], 422);
        }

        $user->update(['practice_id' => null]);

        return response()->json(['message' => 'Staff member removed.']);
    }
}
