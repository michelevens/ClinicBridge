import {
  Calendar,
  Users,
  FileText,
  Video,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative';
}

function StatCard({ label, value, icon, change, changeType }: StatCardProps) {
  return (
    <Card className="hover-lift">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
            {change && (
              <p
                className={`mt-1 text-sm font-medium ${
                  changeType === 'positive' ? 'text-success-500' : 'text-danger-500'
                }`}
              >
                {change}
              </p>
            )}
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-clinical-50 text-clinical-500 dark:bg-clinical-900/20">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Welcome back, {user?.first_name}
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Here&apos;s what&apos;s happening at your practice today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Today's Appointments"
          value="12"
          icon={<Calendar className="h-5 w-5" />}
          change="+2 from yesterday"
          changeType="positive"
        />
        <StatCard
          label="Active Patients"
          value="248"
          icon={<Users className="h-5 w-5" />}
          change="+5 this week"
          changeType="positive"
        />
        <StatCard
          label="Pending Notes"
          value="3"
          icon={<FileText className="h-5 w-5" />}
        />
        <StatCard
          label="Telehealth Today"
          value="4"
          icon={<Video className="h-5 w-5" />}
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-clinical-500" />
              Today&apos;s Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { time: '9:00 AM', patient: 'Sarah Johnson', type: 'Follow-up', status: 'confirmed' as const },
                { time: '9:30 AM', patient: 'Mike Chen', type: 'Telehealth', status: 'checked_in' as const },
                { time: '10:00 AM', patient: 'Emily Davis', type: 'New Patient', status: 'scheduled' as const },
                { time: '10:30 AM', patient: 'James Wilson', type: 'Follow-up', status: 'scheduled' as const },
              ].map((apt) => (
                <div
                  key={`${apt.time}-${apt.patient}`}
                  className="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-slate-700/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {apt.time}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {apt.patient}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{apt.type}</p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      apt.status === 'confirmed'
                        ? 'success'
                        : apt.status === 'checked_in'
                          ? 'clinical'
                          : 'default'
                    }
                  >
                    {apt.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-clinical-500" />
              Practice Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'Appointments This Week', value: '47', change: '+8%' },
                { label: 'New Patients This Month', value: '12', change: '+15%' },
                { label: 'Notes Completed', value: '89%', change: '+3%' },
                { label: 'Telehealth Utilization', value: '34%', change: '+12%' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-slate-700/50"
                >
                  <span className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {stat.value}
                    </span>
                    <span className="text-xs font-medium text-success-500">{stat.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
