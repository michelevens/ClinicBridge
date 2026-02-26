import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Video,
  DollarSign,
  Settings,
  X,
  Stethoscope,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    roles: ['provider', 'patient', 'front_desk', 'biller', 'practice_admin', 'admin'],
  },
  {
    label: 'Patients',
    path: '/patients',
    icon: <Users className="h-5 w-5" />,
    roles: ['provider', 'front_desk', 'practice_admin', 'admin'],
  },
  {
    label: 'Schedule',
    path: '/schedule',
    icon: <Calendar className="h-5 w-5" />,
    roles: ['provider', 'front_desk', 'practice_admin', 'admin'],
  },
  {
    label: 'Clinical Notes',
    path: '/notes',
    icon: <FileText className="h-5 w-5" />,
    roles: ['provider', 'practice_admin'],
  },
  {
    label: 'Telehealth',
    path: '/telehealth',
    icon: <Video className="h-5 w-5" />,
    roles: ['provider', 'patient'],
  },
  {
    label: 'Billing',
    path: '/billing',
    icon: <DollarSign className="h-5 w-5" />,
    roles: ['biller', 'practice_admin', 'admin'],
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: <Settings className="h-5 w-5" />,
    roles: ['practice_admin', 'admin'],
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();

  const filteredItems = navItems.filter(
    (item) => user && item.roles.includes(user.role),
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-700 dark:bg-slate-900 lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-clinical">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gradient-clinical">ClinicBridge</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {filteredItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-clinical-50 text-clinical-600 dark:bg-clinical-900/20 dark:text-clinical-400'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200',
                    )
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Practice info */}
        <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-700">
          <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
            {user?.role === 'admin' ? 'Platform Admin' : 'Practice'}
          </p>
        </div>
      </aside>
    </>
  );
}
