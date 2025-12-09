import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { Plus, Search, DollarSign, ArrowUpRight, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useCurrency } from '@/hooks/useCurrency';

interface RevenueEntry {
  id: string;
  source: string;
  amount: number;
  date: string;
  description: string;
  allocated: boolean;
}

const mockRevenue: RevenueEntry[] = [
  { id: '1', source: 'Project Alpha', amount: 150000, date: '2024-12-05', description: 'Final milestone payment', allocated: true },
  { id: '2', source: 'Consulting Services', amount: 45000, date: '2024-12-04', description: 'Monthly retainer', allocated: true },
  { id: '3', source: 'Product Sales', amount: 28500, date: '2024-12-03', description: 'Q4 product sales', allocated: false },
  { id: '4', source: 'Investment Returns', amount: 12000, date: '2024-12-02', description: 'Quarterly dividends', allocated: false },
];

export function RevenuePage() {
  const [revenue, setRevenue] = useState<RevenueEntry[]>(mockRevenue);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAllocationOpen, setIsAllocationOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<RevenueEntry | null>(null);
  const { formatAmount, formatAmountWithBoth } = useCurrency();

  const totalRevenue = revenue.reduce((sum, r) => sum + r.amount, 0);
  const allocatedRevenue = revenue.filter(r => r.allocated).reduce((sum, r) => sum + r.amount, 0);
  const pendingRevenue = revenue.filter(r => !r.allocated).reduce((sum, r) => sum + r.amount, 0);

  const handleRecordRevenue = () => {
    setIsFormOpen(true);
  };

  const handleViewAllocation = (entry: RevenueEntry) => {
    setSelectedEntry(entry);
    setIsAllocationOpen(true);
  };

  const renderAmount = (amount: number) => {
    const { primary, secondary } = formatAmountWithBoth(amount, 'USD');
    return (
      <div>
        <span className="font-semibold">{primary}</span>
        {secondary && <span className="text-xs text-muted-foreground block">{secondary}</span>}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Revenue</h1>
          <p className="text-muted-foreground">Record and manage revenue entries</p>
        </div>
        <Button onClick={handleRecordRevenue} className="btn-glow">
          <Plus className="h-4 w-4 mr-2" />
          Record Revenue
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              {renderAmount(totalRevenue)}
            </div>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Allocated</p>
              {renderAmount(allocatedRevenue)}
            </div>
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <ArrowUpRight className="h-5 w-5 text-success" />
            </div>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Allocation</p>
              {renderAmount(pendingRevenue)}
            </div>
            <Badge variant="secondary">{revenue.filter(r => !r.allocated).length} entries</Badge>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="card-elevated">
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search revenue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Revenue Table */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Revenue Ledger
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {revenue.map((entry) => (
                <TableRow key={entry.id} className="table-row-hover">
                  <TableCell className="text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium">{entry.source}</TableCell>
                  <TableCell className="text-muted-foreground">{entry.description}</TableCell>
                  <TableCell className="text-right">
                    {renderAmount(entry.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={entry.allocated ? 'default' : 'secondary'}>
                      {entry.allocated ? 'Allocated' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewAllocation(entry)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Record Revenue Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Revenue</DialogTitle>
            <DialogDescription>Add a new revenue entry to the ledger.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Source</Label>
              <Input placeholder="e.g., Project Alpha" />
            </div>
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input type="number" placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Describe the revenue source..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={() => { setIsFormOpen(false); toast.success('Revenue recorded'); }}>
              Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Allocation Preview Dialog */}
      <Dialog open={isAllocationOpen} onOpenChange={setIsAllocationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Allocation Preview</DialogTitle>
            <DialogDescription>
              Revenue of {formatAmount(selectedEntry?.amount || 0, 'USD')} from {selectedEntry?.source}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {[
              { pool: 'Operating', percent: 35 },
              { pool: 'Emergency', percent: 20 },
              { pool: 'Development', percent: 25 },
              { pool: 'Marketing', percent: 12 },
              { pool: 'Reserve', percent: 8 },
            ].map((allocation) => {
              const allocatedAmount = (selectedEntry?.amount || 0) * allocation.percent / 100;
              const { primary, secondary } = formatAmountWithBoth(allocatedAmount, 'USD');
              return (
                <div key={allocation.pool} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <span className="font-medium">{allocation.pool}</span>
                  <div className="text-right">
                    <p className="font-semibold">{primary}</p>
                    {secondary && <p className="text-xs text-muted-foreground">{secondary}</p>}
                    <p className="text-xs text-muted-foreground">{allocation.percent}%</p>
                  </div>
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAllocationOpen(false)}>Close</Button>
            {!selectedEntry?.allocated && (
              <Button onClick={() => { setIsAllocationOpen(false); toast.success('Revenue allocated'); }}>
                Allocate Now
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
