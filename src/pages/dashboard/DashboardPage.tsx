import { StatCard } from '@/components/dashboard/StatCard';
import { RevenueChart, PoolDistributionChart, BudgetComparisonChart } from '@/components/dashboard/DashboardCharts';
import { PendingRequestsWidget } from '@/components/dashboard/PendingRequestsWidget';
import { MilestoneTracker } from '@/components/dashboard/MilestoneTracker';
import { useAuth } from '@/contexts/AuthContext';
import {
  DollarSign,
  Wallet,
  TrendingUp,
  FileCheck,
  Users,
  FolderKanban,
} from 'lucide-react';

export function DashboardPage() {
  const { user, can } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="text-muted-foreground">Here's what's happening across the organization today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {can('dashboard.widgets.revenue') && (
          <StatCard
            title="Total Revenue"
            value="$2.4M"
            change="+12.5% from last month"
            changeType="positive"
            icon={DollarSign}
            iconColor="text-primary"
          />
        )}
        {can('dashboard.widgets.pools') && (
          <StatCard
            title="Pool Balance"
            value="$890K"
            change="5 active pools"
            changeType="neutral"
            icon={Wallet}
            iconColor="text-success"
          />
        )}
        {can('dashboard.widgets.budgets') && (
          <StatCard
            title="Budget Utilized"
            value="68%"
            change="$520K remaining"
            changeType="neutral"
            icon={TrendingUp}
            iconColor="text-warning"
          />
        )}
        {can('dashboard.widgets.requests') && (
          <StatCard
            title="Pending Requests"
            value="24"
            change="8 urgent"
            changeType="negative"
            icon={FileCheck}
            iconColor="text-info"
          />
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <PoolDistributionChart />
      </div>

      {/* Lower Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PendingRequestsWidget />
        </div>
        <MilestoneTracker />
      </div>

      {/* Budget Comparison */}
      <BudgetComparisonChart />
    </div>
  );
}
