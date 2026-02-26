import { Link } from 'react-router-dom';
import {
  Stethoscope,
  Video,
  Calendar,
  FileText,
  Shield,
  Users,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

const features = [
  {
    icon: <Calendar className="h-6 w-6" />,
    title: 'Smart Scheduling',
    description: 'Online booking, automated reminders, and drag-drop rescheduling for your entire practice.',
  },
  {
    icon: <Video className="h-6 w-6" />,
    title: 'Telehealth Video',
    description: 'HIPAA-compliant video visits with waiting room, screen sharing, and in-call chat.',
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: 'Clinical Notes',
    description: 'SOAP, DAP, and BIRP templates with e-signatures and automatic audit trails.',
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Patient Management',
    description: 'Complete patient charts, demographics, insurance verification, and document storage.',
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'HIPAA Compliant',
    description: 'End-to-end encryption, audit logging, MFA, and role-based access controls.',
  },
  {
    icon: <Stethoscope className="h-6 w-6" />,
    title: 'Multi-Provider',
    description: 'Manage multiple providers with individual schedules, availability, and caseloads.',
  },
];

const pricingTiers = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'For solo practitioners getting started',
    features: ['1 provider', 'Up to 25 patients', 'Basic scheduling', 'Clinical notes'],
  },
  {
    name: 'Practice',
    price: '$79',
    period: '/provider/mo',
    description: 'For growing practices',
    features: ['Up to 5 providers', 'Unlimited patients', 'Telehealth', 'Billing & claims', 'Priority support'],
    highlighted: true,
  },
  {
    name: 'Group',
    price: '$149',
    period: '/provider/mo',
    description: 'For multi-location groups',
    features: ['Unlimited providers', 'Unlimited patients', 'All features', 'Custom onboarding', 'Dedicated support'],
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-100 dark:border-slate-800">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-clinical">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient-clinical">ClinicBridge</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-clinical-50/50 to-transparent dark:from-clinical-950/20" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
              Modern Practice Management for{' '}
              <span className="text-gradient-clinical">Small Clinics</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">
              All-in-one telehealth, scheduling, clinical notes, and billing platform
              built for practices with 1-20 providers. HIPAA compliant from day one.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" variant="clinical" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-slate-100 bg-slate-50/50 py-20 dark:border-slate-800 dark:bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Everything your practice needs
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Replace multiple tools with one integrated platform designed for small medical practices.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-premium dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-clinical-50 text-clinical-500 dark:bg-clinical-900/20">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Start free and scale as your practice grows.
            </p>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl border p-8 transition-all duration-300 ${
                  tier.highlighted
                    ? 'border-clinical-500 bg-clinical-50/50 shadow-clinical dark:border-clinical-400 dark:bg-clinical-900/10'
                    : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'
                }`}
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{tier.name}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{tier.description}</p>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">{tier.price}</span>
                  {tier.period && (
                    <span className="text-slate-500 dark:text-slate-400">{tier.period}</span>
                  )}
                </div>
                <ul className="mt-8 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-success-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className="mt-8 block">
                  <Button
                    variant={tier.highlighted ? 'clinical' : 'outline'}
                    className="w-full"
                  >
                    {tier.price === 'Free' ? 'Get Started' : 'Start Trial'}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} ClinicBridge. All rights reserved. HIPAA Compliant.
          </p>
        </div>
      </footer>
    </div>
  );
}
