import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Stethoscope, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { api } from '@/services/api/client';
import { HttpError } from '@/services/api/client';

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormData) => {
    try {
      await api.post('/auth/forgot-password', data);
      setSent(true);
    } catch (error) {
      if (error instanceof HttpError) {
        toast.error(error.data.message);
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-clinical">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient-clinical">ClinicBridge</span>
          </Link>
        </div>

        <Card variant="elevated">
          <CardContent className="p-6">
            {sent ? (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success-100">
                  <CheckCircle2 className="h-6 w-6 text-success-500" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Check your email
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  If an account exists with that email, we&apos;ve sent password reset instructions.
                </p>
                <Link to="/login" className="mt-6 inline-block">
                  <Button variant="outline" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                    Back to sign in
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-6 text-center">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Reset your password
                  </h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Enter your email and we&apos;ll send you a reset link.
                  </p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <Input
                    label="Email"
                    type="email"
                    placeholder="doctor@clinic.com"
                    leftIcon={<Mail className="h-4 w-4" />}
                    error={errors.email?.message}
                    {...register('email')}
                  />
                  <Button
                    type="submit"
                    variant="clinical"
                    className="w-full"
                    size="lg"
                    isLoading={isSubmitting}
                  >
                    Send Reset Link
                  </Button>
                </form>
              </>
            )}
          </CardContent>
        </Card>

        {!sent && (
          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            <Link
              to="/login"
              className="inline-flex items-center gap-1 font-medium text-clinical-500 hover:text-clinical-600"
            >
              <ArrowLeft className="h-3 w-3" /> Back to sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
