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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Calculator, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { BudgetFormDialog } from '@/components/budgets/BudgetFormDialog';

interface Budget {
  id: string;
  department: string;
  fiscal_year: string;
  amount: number;
  spent: number;
  status: 'draft' | 'pending_finance' | 'pending_md' | 'pending_board' | 'approved' | 'rejected';
  created_at: string;
  description?: string;
}

const mockBudgets: Budget[] = [
  { id: '1', department: 'IT', fiscal_year: '2024', amount: 150000, spent: 95000, status: 'approved', created_at: '2024-01-15' },
  { id: '2', department: 'Marketing', fiscal_year: '2024', amount: 120000, spent: 98000, status: 'approved', created_at: '2024-01-15' },
  { id: '3', department: 'Human Resources', fiscal_year: '2024', amount: 80000, spent: 45000, status: 'pending_finance', created_at: '2024-11-20' },
  { id: '4', department: 'Operations', fiscal_year: '2024', amount: 200000, spent: 145000, status: 'pending_md', created_at: '2024-11-18' },
  { id: '5', department: 'Finance', fiscal_year: '2024', amount: 90000, spent: 72000, status: 'pending_board', created_at: '2024-11-15' },
];

const statusConfig: Record<string, { label: string; icon: typeof CheckCircle; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Draft', icon: Clock, variant: 'secondary' },
  pending_finance: { label: 'Finance Review', icon: Clock, variant: 'outline' },
  pending_md: { label: 'MD Approval', icon: Clock, variant: 'outline' },
  pending_board: { label: 'Board Approval', icon: Clock, variant: 'outline' },
  approved: { label: 'Approved', icon: CheckCircle, variant: 'default' },
  rejected: { label: 'Rejected', icon: XCircle, variant: 'destructive' },
};

export function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const pendingCount = budgets.filter(b => b.status.startsWith('pending')).length;

  const filteredBudgets = budgets.filter(b => {
    const matchesSearch = b.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenDialog = (budget?: Budget) => {
    setEditingBudget(budget || null);
    setDialogOpen(true);
  };

  const handleSubmitBudget = (budget: Budget) => {
    if (editingBudget) {
      setBudgets(prev => prev.map(b => b.id === budget.id ? budget : b));
    } else {
      setBudgets(prev => [...prev, budget]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Budgets</h1>
          <p className="text-muted-foreground">Department budget requests and approvals</p>
        </div>
        <Button className="btn-glow" onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Create Budget
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="text-2xl font-bold">${totalBudget.toLocaleString()}</p>
            </div>
            <Calculator className="h-8 w-8 text-primary opacity-50" />
          </div>
        </Card>
        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold">${totalSpent.toLocaleString()}</p>
            </div>
            <Progress value={(totalSpent / totalBudget) * 100} className="w-16 h-2" />
          </div>
        </Card>
        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className="text-2xl font-bold">${(totalBudget - totalSpent).toLocaleString()}</p>
            </div>
            <Badge variant="secondary">{Math.round(((totalBudget - totalSpent) / totalBudget) * 100)}%</Badge>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Approval</p>
              <p className="text-2xl font-bold">{pendingCount}</p>
            </div>
            <Badge variant="outline">{budgets.length} total</Badge>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="card-elevated">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search departments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending_finance">Finance Review</SelectItem>
                <SelectItem value="pending_md">MD Approval</SelectItem>
                <SelectItem value="pending_board">Board Approval</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Budgets Table */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Budget Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Fiscal Year</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Spent</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBudgets.map((budget) => {
                const config = statusConfig[budget.status];
                const utilization = Math.round((budget.spent / budget.amount) * 100);
                
                return (
                  <TableRow key={budget.id} className="table-row-hover">
                    <TableCell className="font-medium">{budget.department}</TableCell>
                    <TableCell>{budget.fiscal_year}</TableCell>
                    <TableCell>${budget.amount.toLocaleString()}</TableCell>
                    <TableCell>${budget.spent.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={utilization} className="w-16 h-2" />
                        <span className="text-sm text-muted-foreground">{utilization}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={config.variant}>{config.label}</Badge>
                    </TableCell>
                    <TableCell>
                      {budget.status.startsWith('pending') && (
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => toast.success('Budget approved')}>
                            Approve
                          </Button>
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => toast.error('Budget rejected')}>
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <BudgetFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        budget={editingBudget}
        onSubmit={handleSubmitBudget}
      />
    </div>
  );
}
