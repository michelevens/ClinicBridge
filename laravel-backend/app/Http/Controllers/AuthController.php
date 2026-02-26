<?php

namespace App\Http\Controllers;

use App\Models\Practice;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(12)->mixedCase()->symbols()],
            'practice_name' => ['required', 'string', 'max:255'],
        ]);

        $practice = Practice::create([
            'name' => $validated['practice_name'],
            'slug' => Str::slug($validated['practice_name']).'-'.Str::random(6),
            'timezone' => 'America/New_York',
            'subscription_tier' => 'free',
            'max_providers' => 1,
            'max_patients' => 25,
        ]);

        $user = User::create([
            'practice_id' => $practice->id,
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'role' => 'practice_admin',
        ]);

        Auth::login($user);

        return response()->json([
            'user' => $user,
            'practice' => $practice,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if ($user && $user->locked_until && $user->locked_until->isFuture()) {
            return response()->json([
                'message' => 'Account is locked. Try again later.',
            ], 429);
        }

        if (! Auth::attempt($validated)) {
            if ($user) {
                $user->increment('failed_login_attempts');
                $maxAttempts = config('clinicbridge.session.max_failed_attempts', 5);
                if ($user->failed_login_attempts >= $maxAttempts) {
                    $lockoutMinutes = config('clinicbridge.session.lockout_minutes', 30);
                    $user->update(['locked_until' => now()->addMinutes($lockoutMinutes)]);
                }
            }

            return response()->json([
                'message' => 'Invalid credentials.',
            ], 401);
        }

        $user = Auth::user();
        $user->update([
            'failed_login_attempts' => 0,
            'locked_until' => null,
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
        ]);

        $request->session()->regenerate();

        return response()->json([
            'user' => $user,
            'practice' => $user->practice,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out.']);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'user' => $user,
            'practice' => $user->practice,
        ]);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        // Always return success to avoid user enumeration
        return response()->json([
            'message' => 'If an account exists, a reset link has been sent.',
        ]);
    }
}
