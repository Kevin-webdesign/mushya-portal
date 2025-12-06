import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Search, FileText, Calendar, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';

interface Contract {
  id: string;
  title: string;
  vendor: string;
  value: number;
  status: 'draft' | 'active' | 'completed' | 'expired' | 'terminated';
  start_date: string;
  end_date: string;
  milestones_completed: number;
  total_milestones: number;
}

const mockContracts: Contract[] = [
  { id: '1', title: 'AWS Cloud Services', vendor: 'Amazon Web Services', value: 120000, status: 'active', start_date: '2024-01-01', end_date: '2024-12-31', milestones_completed: 9, total_milestones: 12 },
  { id: '2', title: 'Security Consulting', vendor: 'SecureIT Corp', value: 85000, status: 'active', start_date: '2024-06-01', end_date: '2025-05-31', milestones_completed: 4, total_milestones: 8 },
  { id: '3', title: 'Office Lease', vendor: 'Commercial Properties Ltd', value: 240000, status: 'active', start_date: '2023-01-01', end_date: '2025-12-31', milestones_completed: 24, total_milestones: 36 },
  { id: '4', title: 'Marketing Agency Retainer', vendor: 'Creative Solutions', value: 60000, status: 'completed', start_date: '2024-01-01', end_date: '2024-06-30', milestones_completed: 6, total_milestones: 6 },
  { id: '5', title: 'HR Software License', vendor: 'WorkDay Inc', value: 45000, status: 'expired', start_date: '2023-01-01', end_date: '2023-12-31', milestones_completed: 4, total_milestones: 4 },
];

const statusConfig: Record<string, { color: string; label: string }> = {
  draft: { color: 'bg-muted text-muted-foreground', label: 'Draft' },
  active: { color: 'bg-success/10 text-success', label: 'Active' },
  completed: { color: 'bg-primary/10 text-primary', label: 'Completed' },
  expired: { color: 'bg-warning/10 text-warning', label: 'Expired' },
  terminated: { color: 'bg-destructive/10 text-destructive', label: 'Terminated' },
};

export function ContractsPage() {
  const [contracts] = useState<Contract[]>(mockContracts);
  const [searchQuery, setSearchQuery] = useState('');

  const totalValue = contracts.reduce((sum, c) => sum + c.value, 0);
  const activeContracts = contracts.filter(c => c.status === 'active').length;
  const expiringContracts = contracts.filter(c => {
    const endDate = new Date(c.end_date);
    const daysUntilExpiry = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return c.status === 'active' && daysUntilExpiry <= 30;
  }).length;

  const filteredContracts = contracts.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.vendor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Contracts</h1>
          <p className="text-muted-foreground">Manage contracts and track milestones</p>
        </div>
        <Button className="btn-glow">
          <Plus className="h-4 w-4 mr-2" />
          New Contract
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Contracts</p>
              <p className="text-2xl font-bold">{contracts.length}</p>
            </div>
            <FileText className="h-8 w-8 text-primary opacity-50" />
          </div>
        </Card>
        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">{activeContracts}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-success opacity-50" />
          </div>
        </Card>
        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold">${(totalValue / 1000).toFixed(0)}K</p>
            </div>
            <DollarSign className="h-8 w-8 text-warning opacity-50" />
          </div>
        </Card>
        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Expiring Soon</p>
              <p className="text-2xl font-bold">{expiringContracts}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-destructive opacity-50" />
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="card-elevated">
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contracts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contracts Table */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>All Contracts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Milestones</TableHead>
                <TableHead>Timeline</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContracts.map((contract) => {
                const milestoneProgress = (contract.milestones_completed / contract.total_milestones) * 100;
                const daysRemaining = getDaysRemaining(contract.end_date);
                
                return (
                  <TableRow key={contract.id} className="table-row-hover cursor-pointer">
                    <TableCell className="font-medium">{contract.title}</TableCell>
                    <TableCell className="text-muted-foreground">{contract.vendor}</TableCell>
                    <TableCell className="font-semibold">${contract.value.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={milestoneProgress} className="w-16 h-2" />
                        <span className="text-sm text-muted-foreground">
                          {contract.milestones_completed}/{contract.total_milestones}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {contract.status === 'active' ? (
                          <span className={daysRemaining <= 30 ? 'text-warning' : 'text-muted-foreground'}>
                            {daysRemaining > 0 ? `${daysRemaining} days left` : 'Expired'}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">
                            {new Date(contract.end_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[contract.status].color}>
                        {statusConfig[contract.status].label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
