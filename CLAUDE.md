# ClinicBridge

Telehealth & Practice Management SaaS for small medical clinics (1-20 providers).

## Tech Stack

### Frontend (`frontend/`)
- React 19 + TypeScript 5.9, Vite 7, Tailwind CSS 4
- React Router v7, React Query 5, React Hook Form 7 + Zod
- Lucide React icons, Sonner toasts, vite-plugin-pwa
- Deploy: GitHub Pages

### Backend (`laravel-backend/`)
- Laravel 12 + PHP 8.4, PostgreSQL 16
- Laravel Sanctum (httpOnly cookies for SPA auth)
- FrankenPHP (Docker), Laravel Pint
- Deploy: Railway

## Commands

### Frontend
```bash
cd frontend
npm run dev          # Start dev server (port 5173)
npm run build        # tsc -b && vite build
npm run lint         # eslint .
npx vitest run       # Run tests
npx tsc -b           # Type check
```

### Backend
```bash
cd laravel-backend
php artisan serve            # Start dev server (port 8000)
php artisan test             # Run PHPUnit tests
vendor/bin/pint              # Format code
vendor/bin/pint --test       # Check formatting
php artisan migrate          # Run migrations
php artisan route:list       # List routes
```

## Architecture

### Multi-Tenancy
- Every table has `practice_id` foreign key
- `BelongsToPractice` trait auto-scopes queries to current user's practice
- Platform `admin` role bypasses tenant scoping

### Authentication
- Sanctum SPA auth with httpOnly cookies
- TOTP MFA required for HIPAA compliance
- Session timeout: 15 min idle (configurable per practice)
- Failed login tracking + account lockout (5 attempts)
- Password: 12+ chars, mixed case, special character

### Roles
`provider` | `patient` | `front_desk` | `biller` | `practice_admin` | `admin`

### HIPAA Compliance
- PHI fields use `encrypted` cast (diagnosis, SSN, insurance)
- All PHI access logged in `audit_logs` table
- Security headers middleware on every response
- Rate limiting on auth (5/min) and API (60/min)
- All clinical models use SoftDeletes

## Design System — "Clinical Trust"

### Colors
- Clinical Blue (Primary): `#0c6b9a` — `clinical-50` to `clinical-950`
- Healing Teal (Secondary): `#14b8a6` — `teal-50` to `teal-950`
- Success: `#22c55e`, Warning: `#f59e0b`, Danger: `#ef4444`

### Conventions
- `rounded-xl` inputs, `rounded-2xl` cards
- `shadow-glass`, `shadow-premium`, `shadow-clinical`
- Glass morphism via `glass` and `glass-clinical` utilities
- `hover-lift` for interactive cards
- `gradient-clinical` for primary gradient backgrounds
- `text-gradient-clinical` for gradient text
- Inter font family

### UI Components (`src/components/ui/`)
Button, Input, Card, Badge, Modal, Select, Textarea

## Code Style
- Frontend: ESLint with `@typescript-eslint/recommended`
- Backend: Laravel Pint (default rules)
- No `any` types — use proper TypeScript types
- `erasableSyntaxOnly` enabled — no constructor parameter properties
- Path alias: `@/` maps to `src/`

## CI/CD
- `.github/workflows/ci.yml`: Lint + type check + test + build (FE) + test + Pint (BE)
- `.github/workflows/deploy-frontend.yml`: Auto-deploy to GitHub Pages on push to main
- Backend deploys to Railway via Dockerfile

## Project Structure

### Frontend key files
- `src/index.css` — Design system tokens and utilities
- `src/lib/utils.ts` — cn(), formatDate, formatCurrency, formatPhone
- `src/types/index.ts` — All TypeScript interfaces
- `src/services/api/client.ts` — Base HTTP client with cookie auth
- `src/contexts/AuthContext.tsx` — Auth state + login/register/logout
- `src/hooks/useAuth.ts` — Auth context hook

### Backend key files
- `config/clinicbridge.php` — App-specific configuration
- `app/Traits/BelongsToPractice.php` — Tenant scoping trait
- `app/Traits/Auditable.php` — PHI audit logging trait
- `app/Http/Middleware/SecurityHeaders.php` — HIPAA security headers
- `app/Http/Middleware/EnsureUserHasRole.php` — Role-based access
- `app/Http/Middleware/EnsurePracticeAccess.php` — Tenant access guard
