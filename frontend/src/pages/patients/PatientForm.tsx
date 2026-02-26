import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { patientApi } from '@/services/api/patients';

const patientSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  sex: z.enum(['male', 'female', 'other']),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().max(2).optional(),
  zip: z.string().max(10).optional(),
  insurance_carrier: z.string().optional(),
  insurance_plan: z.string().optional(),
  insurance_member_id: z.string().optional(),
  insurance_group_id: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  emergency_contact_relationship: z.string().optional(),
  preferred_language: z.string().optional(),
  notes: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

export default function PatientForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = Boolean(id);

  const { data: patient } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => patientApi.get(Number(id)),
    enabled: isEditing,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    values: patient
      ? {
          first_name: patient.first_name,
          last_name: patient.last_name,
          date_of_birth: patient.date_of_birth,
          sex: patient.sex,
          email: patient.email ?? '',
          phone: patient.phone ?? '',
          address: patient.address ?? '',
          city: patient.city ?? '',
          state: patient.state ?? '',
          zip: patient.zip ?? '',
          insurance_carrier: patient.insurance_carrier ?? '',
          insurance_plan: patient.insurance_plan ?? '',
          insurance_member_id: patient.insurance_member_id ?? '',
          insurance_group_id: patient.insurance_group_id ?? '',
          emergency_contact_name: patient.emergency_contact_name ?? '',
          emergency_contact_phone: patient.emergency_contact_phone ?? '',
          emergency_contact_relationship: patient.emergency_contact_relationship ?? '',
          preferred_language: patient.preferred_language ?? '',
          notes: '',
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: (data: PatientFormData) =>
      isEditing ? patientApi.update(Number(id), data) : patientApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast.success(isEditing ? 'Patient updated' : 'Patient created');
      navigate('/patients');
    },
    onError: () => {
      toast.error('Failed to save patient');
    },
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/patients')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {isEditing ? 'Edit Patient' : 'New Patient'}
        </h1>
      </div>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
        {/* Demographics */}
        <Card>
          <CardHeader>
            <CardTitle>Demographics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" error={errors.first_name?.message} {...register('first_name')} />
              <Input label="Last Name" error={errors.last_name?.message} {...register('last_name')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Date of Birth" type="date" error={errors.date_of_birth?.message} {...register('date_of_birth')} />
              <Select
                label="Sex"
                error={errors.sex?.message}
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' },
                ]}
                {...register('sex')}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Email" type="email" {...register('email')} />
              <Input label="Phone" {...register('phone')} />
            </div>
            <Input label="Preferred Language" {...register('preferred_language')} />
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Street Address" {...register('address')} />
            <div className="grid grid-cols-3 gap-4">
              <Input label="City" {...register('city')} />
              <Input label="State" maxLength={2} {...register('state')} />
              <Input label="ZIP" maxLength={10} {...register('zip')} />
            </div>
          </CardContent>
        </Card>

        {/* Insurance */}
        <Card>
          <CardHeader>
            <CardTitle>Insurance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Insurance Carrier" {...register('insurance_carrier')} />
              <Input label="Plan Name" {...register('insurance_plan')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Member ID" {...register('insurance_member_id')} />
              <Input label="Group ID" {...register('insurance_group_id')} />
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Input label="Name" {...register('emergency_contact_name')} />
              <Input label="Phone" {...register('emergency_contact_phone')} />
              <Input label="Relationship" {...register('emergency_contact_relationship')} />
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea placeholder="Internal notes about this patient..." {...register('notes')} />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => navigate('/patients')}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting || mutation.isPending}>
            {isEditing ? 'Save Changes' : 'Create Patient'}
          </Button>
        </div>
      </form>
    </div>
  );
}
