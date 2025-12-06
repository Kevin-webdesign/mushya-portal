import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, Search, CreditCard, CheckCircle, XCircle, Clock, 
  ArrowRight, Upload, Eye, AlertTriangle 
} from 'lucide-react';
import { toast } from 'sonner';

interface Disbursement {
  id: string;
  title: string;
  amount: number;
  department: string;
  requestor: string;
  status: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  current_approver?: string;
}

const mockDisbursements: Disbursement[] = [
  { id: '1', title: 'Office Equipment', amount: 5000, department: 'IT', requestor: 'John Doe', status: 'pending', priority: 'medium', created_at: '2024-12-05', current_approver: 'Department Leader' },
  { id: '2', title: 'Marketing Campaign', amount: 15000, department: 'Marketing', requestor: 'Sarah Chen', status: 'dept_approved', priority: 'high', created_at: '2024-12-04', current_approver: 'Finance' },
  { id: '3', title: 'Training Program', amount: 8000, department: 'HR', requestor: 'Emily Davis', status: 'finance_validated', priority: 'low', created_at: '2024-12-03', current_approver: 'COO' },
  { id: '4', title: 'Server Upgrade', amount: 25000, department: 'IT', requestor: 'Mike Johnson', status: 'coo_approved', priority: 'urgent', created_at: '2024-12-02', current_approver: 'MD' },
  { id: '5', title: 'Client Event', amount: 12000, department: 'Sales', requestor: 'Alex Wilson', status: 'paid', priority: 'medium', created_at: '2024-12-01' },
];

const statusSteps = [
  { key: 'pending', label: 'Pending' },
  { key: 'dept_approved', label: 'Dept. Approved' },
  { key: 'finance_validated', label: 'Finance Validated' },
  { key: 'coo_approved', label: 'COO Approved' },
  { key: 'md_approved', label: 'MD Approved' },
  { key: 'paid', label: 'Paid' },
];

const priorityConfig: Record<string, { color: string; label: string }> = {
  low: { color: 'bg-muted text-muted-foreground', label: 'Low' },
  medium: { color: 'bg-info/10 text-info', label: 'Medium' },
  high: { color: 'bg-warning/10 text-warning', label: 'High' },
  urgent: { color: 'bg-destructive/10 text-destructive', label: 'Urgent' },
};

export function DisbursementsPage() {
  const [disbursements] = useState<Disbursement[]>(mockDisbursements);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDisbursement, setSelectedDisbursement] = useState<Disbursement | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const pendingAmount = disbursements.filter(d => d.status !== 'paid').reduce((sum, d) => sum + d.amount, 0);
  const paidAmount = disbursements.filter(d => d.status === 'paid').reduce((sum, d) => sum + d.amount, 0);
  const urgentCount = disbursements.filter(d => d.priority === 'urgent' && d.status !== 'paid').length;

  const getStatusIndex = (status: string) => {
    return statusSteps.findIndex(s => s.key === status);
  };

  const handleViewDetails = (d: Disbursement) => {
    setSelectedDisbursement(d);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Disbursements</h1>
          <p className="text-muted-foreground">Fund disbursement requests and approval workflow</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="btn-glow">
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Requests</p>
              <p className="text-2xl font-bold">{disbursements.filter(d => d.status !== 'paid').length}</p>
            </div>
            <CreditCard className="h-8 w-8 text-primary opacity-50" />
          </div>
        </Card>
        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Amount</p>
              <p className="text-2xl font-bold">${pendingAmount.toLocaleString()}</p>
            </div>
            <Clock className="h-8 w-8 text-warning opacity-50" />
          </div>
        </Card>
        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Paid This Month</p>
              <p className="text-2xl font-bold">${paidAmount.toLocaleString()}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-success opacity-50" />
          </div>
        </Card>
        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Urgent</p>
              <p className="text-2xl font-bold">{urgentCount}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-destructive opacity-50" />
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="card-elevated">
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Disbursements Table */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Disbursement Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Current Stage</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disbursements.map((d) => {
                const statusIndex = getStatusIndex(d.status);
                const progress = ((statusIndex + 1) / statusSteps.length) * 100;
                
                return (
                  <TableRow key={d.id} className="table-row-hover">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {d.requestor.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{d.title}</p>
                          <p className="text-sm text-muted-foreground">{d.requestor} • {d.department}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">${d.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={priorityConfig[d.priority].color}>
                        {priorityConfig[d.priority].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {d.status === 'paid' ? (
                          <Badge variant="default" className="bg-success">Paid</Badge>
                        ) : (
                          <>
                            <Badge variant="outline">{statusSteps[statusIndex]?.label}</Badge>
                            {d.current_approver && (
                              <span className="text-xs text-muted-foreground">→ {d.current_approver}</span>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{statusIndex + 1}/{statusSteps.length}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleViewDetails(d)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {d.status !== 'paid' && (
                          <Button size="sm" variant="outline" onClick={() => toast.success('Approved')}>
                            Approve
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* New Request Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Disbursement Request</DialogTitle>
            <DialogDescription>Submit a new fund disbursement request.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input placeholder="e.g., Office Equipment" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Describe the purpose of this request..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={() => { setIsFormOpen(false); toast.success('Request submitted'); }}>
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedDisbursement?.title}</DialogTitle>
            <DialogDescription>
              Requested by {selectedDisbursement?.requestor} from {selectedDisbursement?.department}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
              <span className="text-muted-foreground">Amount</span>
              <span className="text-xl font-bold">${selectedDisbursement?.amount.toLocaleString()}</span>
            </div>
            
            {/* Timeline */}
            <div className="space-y-2">
              <Label>Approval Timeline</Label>
              <div className="space-y-3">
                {statusSteps.map((step, index) => {
                  const currentIndex = getStatusIndex(selectedDisbursement?.status || '');
                  const isCompleted = index <= currentIndex;
                  const isCurrent = index === currentIndex;
                  
                  return (
                    <div key={step.key} className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        {isCompleted ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                      </div>
                      <span className={isCurrent ? 'font-medium' : 'text-muted-foreground'}>
                        {step.label}
                      </span>
                      {isCurrent && <Badge variant="outline" className="ml-auto">Current</Badge>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
