import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { patientApi } from '@/services/api/patients';
import { formatDate, formatPhone } from '@/lib/utils';
import type { Patient } from '@/types';

export default function Patients() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['patients', { search, status, page }],
    queryFn: () => patientApi.list({ search, status, page, per_page: 25 }),
  });

  const patients = data?.data ?? [];
  const meta = data?.meta;

  const statusBadge = (s: Patient['status']) => {
    const variants = {
      active: 'success' as const,
      inactive: 'default' as const,
      deceased: 'danger' as const,
    };
    return <Badge variant={variants[s]}>{s}</Badge>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Patients</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {meta ? `${meta.total} patients` : 'Loading...'}
          </p>
        </div>
        <Link to="/patients/new">
          <Button leftIcon={<Plus className="h-4 w-4" />}>Add Patient</Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <Input
                placeholder="Search by name, MRN, email, or phone..."
                leftIcon={<Search className="h-4 w-4" />}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="w-40">
              <Select
                placeholder="All statuses"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                options={[
                  { value: '', label: 'All statuses' },
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'deceased', label: 'Deceased' },
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient List */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Directory</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-clinical-500 border-t-transparent" />
            </div>
          ) : patients.length === 0 ? (
            <div className="py-12 text-center">
              <User className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4 text-sm text-slate-500">No patients found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700/50">
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">MRN</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">DOB</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Last Visit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {patients.map((patient) => (
                    <tr
                      key={patient.id}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <td className="px-6 py-4">
                        <Link
                          to={`/patients/${patient.id}`}
                          className="font-medium text-clinical-600 hover:text-clinical-700 dark:text-clinical-400"
                        >
                          {patient.last_name}, {patient.first_name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {patient.mrn}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {formatDate(patient.date_of_birth)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {patient.phone ? formatPhone(patient.phone) : '—'}
                      </td>
                      <td className="px-6 py-4">{statusBadge(patient.status)}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {patient.last_visit_at ? formatDate(patient.last_visit_at) : 'Never'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3 dark:border-slate-700/50">
              <p className="text-sm text-slate-500">
                Page {meta.current_page} of {meta.last_page}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.current_page === 1}
                  onClick={() => setPage(page - 1)}
                  leftIcon={<ChevronLeft className="h-4 w-4" />}
                >
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.current_page === meta.last_page}
                  onClick={() => setPage(page + 1)}
                  rightIcon={<ChevronRight className="h-4 w-4" />}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
