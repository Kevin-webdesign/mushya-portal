import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, ArrowRight, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Request {
  id: string;
  title: string;
  type: 'disbursement' | 'budget' | 'pool';
  amount: number;
  requestor: string;
  department: string;
  status: string;
  created_at: string;
}

const mockRequests: Request[] = [
  {
    id: '1',
    title: 'Q1 Marketing Campaign',
    type: 'budget',
    amount: 25000,
    requestor: 'Sarah Chen',
    department: 'Marketing',
    status: 'pending_finance',
    created_at: '2024-12-05T10:00:00Z',
  },
  {
    id: '2',
    title: 'Office Equipment',
    type: 'disbursement',
    amount: 5000,
    requestor: 'John Doe',
    department: 'IT',
    status: 'pending',
    created_at: '2024-12-05T14:30:00Z',
  },
  {
    id: '3',
    title: 'Development Pool Increase',
    type: 'pool',
    amount: 50000,
    requestor: 'Mike Johnson',
    department: 'Finance',
    status: 'pending_md',
    created_at: '2024-12-04T09:00:00Z',
  },
  {
    id: '4',
    title: 'Training Program',
    type: 'budget',
    amount: 15000,
    requestor: 'Emily Davis',
    department: 'HR',
    status: 'pending_board',
    created_at: '2024-12-03T16:00:00Z',
  },
];

const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    pending: { label: 'Pending', variant: 'secondary' },
    pending_finance: { label: 'Finance Review', variant: 'outline' },
    pending_md: { label: 'MD Approval', variant: 'outline' },
    pending_board: { label: 'Board Approval', variant: 'outline' },
    approved: { label: 'Approved', variant: 'default' },
    rejected: { label: 'Rejected', variant: 'destructive' },
  };
  
  const config = statusConfig[status] || { label: status, variant: 'secondary' as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const getTypeBadge = (type: string) => {
  const typeConfig: Record<string, { label: string; className: string }> = {
    disbursement: { label: 'Disbursement', className: 'bg-chart-1/10 text-chart-1 border-chart-1/20' },
    budget: { label: 'Budget', className: 'bg-chart-2/10 text-chart-2 border-chart-2/20' },
    pool: { label: 'Pool', className: 'bg-chart-3/10 text-chart-3 border-chart-3/20' },
  };
  
  const config = typeConfig[type] || { label: type, className: '' };
  return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
};

export function PendingRequestsWidget() {
  return (
    <Card className="card-elevated">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Pending Requests</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary">
          View All <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockRequests.map((request) => (
          <div
            key={request.id}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {request.requestor.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{request.title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{request.requestor}</span>
                  <span>•</span>
                  <span>{request.department}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-semibold">${request.amount.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>2h ago</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                {getTypeBadge(request.type)}
                {getStatusBadge(request.status)}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
