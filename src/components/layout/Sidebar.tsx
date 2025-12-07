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
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
    permission: 'dashboard.view',
  },
  {
    id: 'users-roles',
    label: 'Users & Roles',
    icon: Users,
    permission: 'users.view',
    children: [
      { id: 'users', label: 'Users', icon: Users, path: '/users', permission: 'users.view' },
      { id: 'roles', label: 'Roles', icon: Shield, path: '/roles', permission: 'roles.view' },
    ],
  },
  {
    id: 'revenue',
    label: 'Revenue',
    icon: DollarSign,
    path: '/revenue',
    permission: 'revenue.view',
  },
  {
    id: 'pools',
    label: 'Pool Management',
    icon: Wallet,
    path: '/pools',
    permission: 'pools.view',
  },
  {
    id: 'budgets',
    label: 'Budgets',
    icon: Calculator,
    path: '/budgets',
    permission: 'budgets.view',
  },
  {
    id: 'disbursements',
    label: 'Disbursements',
    icon: CreditCard,
    path: '/disbursements',
    permission: 'disbursements.view',
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: FolderKanban,
    path: '/projects',
    permission: 'projects.view',
  },
  {
    id: 'contracts',
    label: 'Contracts',
    icon: FileText,
    path: '/contracts',
    permission: 'contracts.view',
  },
  {
    id: 'vault',
    label: 'Password Vault',
    icon: KeyRound,
    path: '/vault',
    permission: 'vault.view',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart3,
    path: '/reports',
    permission: 'reports.view',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/settings',
    permission: 'settings.view',
  },
];

interface SidebarProps {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed, onCollapsedChange }: SidebarProps) {
  const [openMenus, setOpenMenus] = useState<string[]>(['users-roles']);
  const location = useLocation();
  const { can } = useAuth();

  const toggleMenu = (id: string) => {
    setOpenMenus(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const renderNavItem = (item: NavItem) => {
    // Check if user has permission
    if (!can(item.permission)) {
      // Check if any child has permission
      if (item.children) {
        const hasAccessibleChild = item.children.some(child => can(child.permission));
        if (!hasAccessibleChild) return null;
      } else {
        return null;
      }
    }

    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openMenus.includes(item.id);
    const active = isActive(item.path);

    if (hasChildren) {
      const accessibleChildren = item.children!.filter(child => can(child.permission));
      if (accessibleChildren.length === 0) return null;

      if (collapsed) {
        return (
          <div key={item.id} className="space-y-1">
            {accessibleChildren.map(child => {
              const ChildIcon = child.icon;
              return (
                <Tooltip key={child.id} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      to={child.path!}
                      className={cn(
                        'sidebar-item justify-center',
                        isActive(child.path) && 'active'
                      )}
                    >
                      <ChildIcon className="h-5 w-5 shrink-0" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10}>
                    {child.label}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        );
      }

      return (
        <Collapsible key={item.id} open={isOpen} onOpenChange={() => toggleMenu(item.id)}>
          <CollapsibleTrigger asChild>
            <button
              className={cn(
                'sidebar-item w-full justify-between',
                isOpen && 'bg-sidebar-accent'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  isOpen && 'rotate-180'
                )}
              />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4 mt-1 space-y-1">
            {accessibleChildren.map(child => {
              const ChildIcon = child.icon;
              return (
                <Link
                  key={child.id}
                  to={child.path!}
                  className={cn(
                    'sidebar-item',
                    isActive(child.path) && 'active'
                  )}
                >
                  <ChildIcon className="h-4 w-4 shrink-0" />
                  <span className="text-sm">{child.label}</span>
                </Link>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    if (collapsed) {
      return (
        <Tooltip key={item.id} delayDuration={0}>
          <TooltipTrigger asChild>
            <Link
              to={item.path!}
              className={cn('sidebar-item justify-center', active && 'active')}
            >
              <Icon className="h-5 w-5 shrink-0" />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            {item.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <Link
        key={item.id}
        to={item.path!}
        className={cn('sidebar-item', active && 'active')}
      >
        <Icon className="h-5 w-5 shrink-0" />
        <span>{item.label}</span>
      </Link>
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
      <nav className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-1">
        {navigationItems.map(renderNavItem)}
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
