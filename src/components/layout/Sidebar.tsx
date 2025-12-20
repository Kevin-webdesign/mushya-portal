import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  Shield,
  DollarSign,
  Wallet,
  Calculator,
  CreditCard,
  FolderKanban,
  FileText,
  KeyRound,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path?: string;
  permission: string;
}

interface NavCategory {
  id: string;
  label: string;
  icon: React.ElementType;
  items: NavItem[];
}

const navigationCategories: NavCategory[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', permission: 'dashboard.view' },
    ],
  },
  {
    id: 'user-management',
    label: 'User Management',
    icon: Users,
    items: [
      { id: 'users', label: 'Users', icon: Users, path: '/users', permission: 'users.view' },
      { id: 'roles', label: 'Roles', icon: Shield, path: '/roles', permission: 'roles.view' },
    ],
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: DollarSign,
    items: [
      { id: 'revenue', label: 'Revenue', icon: DollarSign, path: '/revenue', permission: 'revenue.view' },
      { id: 'pools', label: 'Pool Management', icon: Wallet, path: '/pools', permission: 'pools.view' },
      { id: 'budgets', label: 'Budgets', icon: Calculator, path: '/budgets', permission: 'budgets.view' },
      { id: 'disbursements', label: 'Disbursements', icon: CreditCard, path: '/disbursements', permission: 'disbursements.view' },
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    icon: FolderKanban,
    items: [
      { id: 'projects', label: 'Projects', icon: FolderKanban, path: '/projects', permission: 'projects.view' },
      { id: 'contracts', label: 'Contracts', icon: FileText, path: '/contracts', permission: 'contracts.view' },
    ],
  },
  {
    id: 'security',
    label: 'Security',
    icon: KeyRound,
    items: [
      { id: 'vault', label: 'Password Vault', icon: KeyRound, path: '/vault', permission: 'vault.view' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    items: [
      { id: 'reports', label: 'Reports', icon: BarChart3, path: '/reports', permission: 'reports.view' },
    ],
  },
  {
    id: 'system',
    label: 'System',
    icon: Settings,
    items: [
      { id: 'settings', label: 'Settings', icon: Settings, path: '/settings', permission: 'settings.view' },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed, onCollapsedChange }: SidebarProps) {
  const [openCategories, setOpenCategories] = useState<string[]>(['overview', 'user-management', 'finance']);
  const location = useLocation();
  const { can } = useAuth();

  const toggleCategory = (id: string) => {
    setOpenCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const renderCategory = (category: NavCategory) => {
    const accessibleItems = category.items.filter(item => can(item.permission));
    if (accessibleItems.length === 0) return null;

    const isOpen = openCategories.includes(category.id);
    const CategoryIcon = category.icon;

    if (collapsed) {
      return (
        <div key={category.id} className="space-y-1">
          {accessibleItems.map(item => {
            const ItemIcon = item.icon;
            return (
              <Tooltip key={item.id} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.path!}
                    className={cn(
                      'sidebar-item justify-center',
                      isActive(item.path) && 'active'
                    )}
                  >
                    <ItemIcon className="h-5 w-5 shrink-0" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={10}>
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      );
    }

    return (
      <Collapsible key={category.id} open={isOpen} onOpenChange={() => toggleCategory(category.id)}>
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              'sidebar-item w-full justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground',
              isOpen && 'text-foreground'
            )}
          >
            <div className="flex items-center gap-3">
              <CategoryIcon className="h-4 w-4 shrink-0" />
              <span>{category.label}</span>
            </div>
            <ChevronDown
              className={cn(
                'h-3 w-3 transition-transform duration-200',
                isOpen && 'rotate-180'
              )}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-1 space-y-1">
          {accessibleItems.map(item => {
            const ItemIcon = item.icon;
            return (
              <Link
                key={item.id}
                to={item.path!}
                className={cn(
                  'sidebar-item pl-10',
                  isActive(item.path) && 'active'
                )}
              >
                <ItemIcon className="h-4 w-4 shrink-0" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-3 border-b border-sidebar-border">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-foreground truncate">Mushya Group</span>
              <span className="text-xs text-muted-foreground truncate">Internal Portal</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-2">
        {navigationCategories.map(renderCategory)}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCollapsedChange(!collapsed)}
          className="w-full justify-center text-muted-foreground hover:text-foreground"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
