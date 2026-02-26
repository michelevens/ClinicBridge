import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Video,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { appointmentApi } from '@/services/api/appointments';
import { formatTime } from '@/lib/utils';
import type { Appointment, AppointmentStatus } from '@/types';

function getStatusVariant(status: AppointmentStatus) {
  const map = {
    scheduled: 'default' as const,
    confirmed: 'success' as const,
    checked_in: 'clinical' as const,
    in_progress: 'info' as const,
    completed: 'success' as const,
    cancelled: 'danger' as const,
    no_show: 'warning' as const,
  };
  return map[status];
}

function formatDateHeader(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function toISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export default function Schedule() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments', toISODate(currentDate)],
    queryFn: () => appointmentApi.list({ date: toISODate(currentDate) }),
  });

  const navigateDay = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + offset);
    setCurrentDate(newDate);
  };

  const goToToday = () => setCurrentDate(new Date());

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Schedule</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {appointments.length} appointment{appointments.length !== 1 ? 's' : ''} today
          </p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />}>Book Appointment</Button>
      </div>

      {/* Date Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={() => navigateDay(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {formatDateHeader(currentDate)}
              </h2>
              <Button variant="ghost" size="sm" onClick={goToToday}>
                Today
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigateDay(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-clinical-500" />
            Appointments
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-clinical-500 border-t-transparent" />
            </div>
          ) : appointments.length === 0 ? (
            <div className="py-12 text-center">
              <Clock className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4 text-sm text-slate-500">No appointments scheduled</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {appointments.map((apt: Appointment) => (
                <div
                  key={apt.id}
                  className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  {/* Time */}
                  <div className="w-24 shrink-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {formatTime(new Date(`2000-01-01T${apt.start_time}`))}
                    </p>
                    <p className="text-xs text-slate-500">
                      {apt.appointment_type?.duration_minutes ?? 30} min
                    </p>
                  </div>

                  {/* Color bar */}
                  <div
                    className="h-12 w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: apt.appointment_type?.color ?? '#0c6b9a' }}
                  />

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">
                      {apt.patient?.last_name}, {apt.patient?.first_name}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                      <span>{apt.appointment_type?.name}</span>
                      {apt.type === 'telehealth' && (
                        <span className="inline-flex items-center gap-1 text-teal-600">
                          <Video className="h-3 w-3" /> Telehealth
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Provider */}
                  <div className="hidden items-center gap-2 text-sm text-slate-600 sm:flex dark:text-slate-400">
                    <User className="h-4 w-4" />
                    Dr. {apt.provider?.last_name}
                  </div>

                  {/* Status */}
                  <Badge variant={getStatusVariant(apt.status)}>
                    {apt.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
