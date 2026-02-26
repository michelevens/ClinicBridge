import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { noteApi } from '@/services/api/notes';
import { formatDate } from '@/lib/utils';
import type { NoteStatus, NoteTemplateType } from '@/types';

function statusBadge(status: NoteStatus) {
  const variants = {
    draft: 'warning' as const,
    completed: 'default' as const,
    signed: 'success' as const,
    amended: 'info' as const,
  };
  return <Badge variant={variants[status]}>{status}</Badge>;
}

function templateLabel(type: NoteTemplateType) {
  return type.toUpperCase();
}

export default function Notes() {
  const [status, setStatus] = useState('');
  const [templateType, setTemplateType] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['notes', { status, templateType, page }],
    queryFn: () => noteApi.list({ status: status || undefined, template_type: templateType || undefined, page }),
  });

  const notes = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Clinical Notes</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {meta ? `${meta.total} notes` : 'Loading...'}
          </p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />}>New Note</Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="w-40">
              <Select
                placeholder="All statuses"
                value={status}
                onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                options={[
                  { value: '', label: 'All statuses' },
                  { value: 'draft', label: 'Draft' },
                  { value: 'signed', label: 'Signed' },
                  { value: 'amended', label: 'Amended' },
                ]}
              />
            </div>
            <div className="w-40">
              <Select
                placeholder="All types"
                value={templateType}
                onChange={(e) => { setTemplateType(e.target.value); setPage(1); }}
                options={[
                  { value: '', label: 'All types' },
                  { value: 'soap', label: 'SOAP' },
                  { value: 'dap', label: 'DAP' },
                  { value: 'birp', label: 'BIRP' },
                  { value: 'free_text', label: 'Free Text' },
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-clinical-500" />
            Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-clinical-500 border-t-transparent" />
            </div>
          ) : notes.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4 text-sm text-slate-500">No notes found</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {note.patient?.last_name}, {note.patient?.first_name}
                    </p>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-500">
                      <span>{templateLabel(note.template_type)}</span>
                      <span>{formatDate(note.date_of_service)}</span>
                      <span>Dr. {note.provider?.last_name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {statusBadge(note.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
