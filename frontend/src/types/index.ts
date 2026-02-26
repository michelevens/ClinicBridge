/* ─── Enums ─── */

export type UserRole = 'provider' | 'patient' | 'front_desk' | 'biller' | 'practice_admin' | 'admin';

export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'checked_in'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type AppointmentType = 'in_person' | 'telehealth';

export type NoteTemplateType = 'soap' | 'dap' | 'birp' | 'free_text';

export type NoteStatus = 'draft' | 'completed' | 'signed' | 'amended';

export type PatientStatus = 'active' | 'inactive' | 'deceased';

export type SubscriptionTier = 'free' | 'practice' | 'group' | 'enterprise';

export type ChargeStatus = 'draft' | 'submitted' | 'approved' | 'billed';

export type ProblemStatus = 'active' | 'resolved' | 'chronic';

export type MedicationStatus = 'active' | 'discontinued' | 'completed';

export type AllergySeverity = 'mild' | 'moderate' | 'severe' | 'life_threatening';

export type AuditRiskLevel = 'low' | 'medium' | 'high' | 'critical';

/* ─── Core Models ─── */

export interface User {
  id: number;
  practice_id: number | null;
  email: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  phone: string | null;
  avatar_url: string | null;
  email_verified_at: string | null;
  mfa_enabled: boolean;
  onboarding_completed: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Practice {
  id: number;
  name: string;
  slug: string;
  npi: string | null;
  tax_id: string | null;
  specialty: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  phone: string | null;
  fax: string | null;
  email: string | null;
  website: string | null;
  logo_url: string | null;
  operating_hours: Record<string, { open: string; close: string }> | null;
  timezone: string;
  subscription_tier: SubscriptionTier;
  max_providers: number;
  max_patients: number;
  settings: PracticeSettings | null;
  created_at: string;
  updated_at: string;
}

export interface PracticeSettings {
  appointment_reminders: boolean;
  telehealth_enabled: boolean;
  self_scheduling: boolean;
  session_timeout_minutes: number;
}

export interface Patient {
  id: number;
  practice_id: number;
  user_id: number | null;
  mrn: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  sex: 'male' | 'female' | 'other';
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  insurance_carrier: string | null;
  insurance_plan: string | null;
  insurance_member_id: string | null;
  insurance_group_id: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  emergency_contact_relationship: string | null;
  allergies: string[];
  preferred_language: string | null;
  status: PatientStatus;
  last_visit_at: string | null;
  total_visits: number;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: number;
  practice_id: number;
  patient_id: number;
  provider_id: number;
  appointment_type_id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  type: AppointmentType;
  telehealth_room_id: string | null;
  telehealth_link: string | null;
  reason: string | null;
  notes: string | null;
  cancellation_reason: string | null;
  copay_amount: number | null;
  copay_collected: boolean;
  patient?: Patient;
  provider?: User;
  appointment_type?: AppointmentTypeConfig;
  created_at: string;
  updated_at: string;
}

export interface AppointmentTypeConfig {
  id: number;
  practice_id: number;
  name: string;
  duration_minutes: number;
  color: string;
  is_telehealth: boolean;
  is_default: boolean;
  allow_self_schedule: boolean;
  buffer_minutes: number;
  max_per_day: number | null;
}

export interface ClinicalNote {
  id: number;
  practice_id: number;
  patient_id: number;
  provider_id: number;
  appointment_id: number | null;
  template_type: NoteTemplateType;
  content: Record<string, unknown>;
  date_of_service: string;
  session_duration_minutes: number | null;
  diagnosis_codes: string[];
  status: NoteStatus;
  signed_at: string | null;
  signed_by: number | null;
  patient?: Patient;
  provider?: User;
  created_at: string;
  updated_at: string;
}

export interface PracticeInvite {
  id: number;
  practice_id: number;
  email: string;
  role: UserRole;
  token: string;
  invited_by: number;
  accepted_at: string | null;
  expires_at: string;
  created_at: string;
}

/* ─── API Types ─── */

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  practice_name: string;
}

export interface AuthResponse {
  user: User;
  practice: Practice | null;
}
