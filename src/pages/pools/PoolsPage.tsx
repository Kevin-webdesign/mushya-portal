import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Wallet, Settings, TrendingUp, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Pool {
  id: string;
  name: string;
  description: string;
  percentage: number;
  balance: number;
  status: 'active' | 'inactive';
  color: string;
}

const mockPools: Pool[] = [
  { id: '1', name: 'Operating Fund', description: 'Day-to-day operational expenses', percentage: 35, balance: 312500, status: 'active', color: 'hsl(217, 91%, 60%)' },
  { id: '2', name: 'Emergency Reserve', description: 'Emergency and contingency fund', percentage: 20, balance: 178500, status: 'active', color: 'hsl(160, 84%, 39%)' },
  { id: '3', name: 'Development Fund', description: 'R&D and new initiatives', percentage: 25, balance: 223200, status: 'active', color: 'hsl(38, 92%, 50%)' },
  { id: '4', name: 'Marketing Budget', description: 'Marketing and advertising', percentage: 12, balance: 107100, status: 'active', color: 'hsl(280, 65%, 60%)' },
  { id: '5', name: 'Reserve Fund', description: 'Long-term strategic reserve', percentage: 8, balance: 71400, status: 'active', color: 'hsl(199, 89%, 48%)' },
];

export function PoolsPage() {
  const [pools, setPools] = useState<Pool[]>(mockPools);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAllocationOpen, setIsAllocationOpen] = useState(false);

  const totalBalance = pools.reduce((sum, p) => sum + p.balance, 0);
  const totalPercentage = pools.reduce((sum, p) => sum + p.percentage, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pool Management</h1>
          <p className="text-muted-foreground">Manage fund pools and allocation percentages</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsAllocationOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Set Allocations
          </Button>
          <Button onClick={() => setIsFormOpen(true)} className="btn-glow">
            <Plus className="h-4 w-4 mr-2" />
            Create Pool
          </Button>
        </div>
      </div>

      {/* Total Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Pool Balance</p>
              <p className="text-2xl font-bold">${totalBalance.toLocaleString()}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Pools</p>
              <p className="text-2xl font-bold">{pools.filter(p => p.status === 'active').length}</p>
            </div>
            <Badge variant="secondary">{pools.length} total</Badge>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Allocation Total</p>
              <p className="text-2xl font-bold">{totalPercentage}%</p>
            </div>
            {totalPercentage !== 100 && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Unbalanced
              </Badge>
            )}
          </div>
        </Card>
      </div>

      {/* Pool Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pools.map((pool) => (
          <Card key={pool.id} className="card-elevated overflow-hidden">
            <div className="h-1" style={{ backgroundColor: pool.color }} />
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{pool.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{pool.description}</p>
                </div>
                <Badge variant={pool.status === 'active' ? 'default' : 'secondary'}>
                  {pool.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Balance</span>
                  <span className="font-semibold">${pool.balance.toLocaleString()}</span>
                </div>
                <Progress value={(pool.balance / totalBalance) * 100} className="h-2" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Allocation</span>
                <span className="font-semibold text-lg">{pool.percentage}%</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  History
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Pool Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Pool</DialogTitle>
            <DialogDescription>Add a new fund pool to manage allocations.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Pool Name</Label>
              <Input placeholder="e.g., Innovation Fund" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Describe the pool's purpose..." />
            </div>
            <div className="space-y-2">
              <Label>Initial Allocation %</Label>
              <Input type="number" placeholder="0" min="0" max="100" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={() => { setIsFormOpen(false); toast.success('Pool created'); }}>
              Create Pool
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Set Allocations Dialog */}
      <Dialog open={isAllocationOpen} onOpenChange={setIsAllocationOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Set Allocation Percentages</DialogTitle>
            <DialogDescription>Adjust how revenue is distributed across pools.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {pools.map((pool) => (
              <div key={pool.id} className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: pool.color }} />
                <Label className="flex-1">{pool.name}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    className="w-20"
                    defaultValue={pool.percentage}
                    min="0"
                    max="100"
                  />
                  <span className="text-muted-foreground">%</span>
                </div>
              </div>
            ))}
            <div className="border-t border-border pt-3 flex items-center justify-between font-semibold">
              <span>Total</span>
              <span className={totalPercentage === 100 ? 'text-success' : 'text-destructive'}>
                {totalPercentage}%
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAllocationOpen(false)}>Cancel</Button>
            <Button onClick={() => { setIsAllocationOpen(false); toast.success('Allocations updated'); }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
