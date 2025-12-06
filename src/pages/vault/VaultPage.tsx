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
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Plus, Search, KeyRound, Eye, EyeOff, Copy, Shield, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface VaultEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  category: string;
  last_accessed?: string;
}

const mockVaultEntries: VaultEntry[] = [
  { id: '1', title: 'AWS Root Account', username: 'admin@mushyagroup.com', password: '••••••••••••', url: 'https://aws.amazon.com', category: 'Cloud', last_accessed: '2024-12-05' },
  { id: '2', title: 'GitHub Organization', username: 'mushya-admin', password: '••••••••••••', url: 'https://github.com', category: 'Development', last_accessed: '2024-12-04' },
  { id: '3', title: 'Stripe Dashboard', username: 'finance@mushyagroup.com', password: '••••••••••••', url: 'https://stripe.com', category: 'Finance', last_accessed: '2024-12-03' },
  { id: '4', title: 'Google Workspace Admin', username: 'admin@mushyagroup.com', password: '••••••••••••', url: 'https://admin.google.com', category: 'Productivity' },
  { id: '5', title: 'Slack Workspace', username: 'workspace-admin', password: '••••••••••••', url: 'https://slack.com', category: 'Communication' },
];

const categoryColors: Record<string, string> = {
  Cloud: 'bg-chart-1/10 text-chart-1',
  Development: 'bg-chart-2/10 text-chart-2',
  Finance: 'bg-chart-3/10 text-chart-3',
  Productivity: 'bg-chart-4/10 text-chart-4',
  Communication: 'bg-chart-5/10 text-chart-5',
};

export function VaultPage() {
  const [entries] = useState<VaultEntry[]>(mockVaultEntries);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOTPOpen, setIsOTPOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<VaultEntry | null>(null);
  const [otp, setOtp] = useState('');
  const [revealedPasswords, setRevealedPasswords] = useState<Set<string>>(new Set());
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleRevealPassword = (entry: VaultEntry) => {
    setSelectedEntry(entry);
    setOtp('');
    setIsOTPOpen(true);
  };

  const handleVerifyOTP = () => {
    if (otp === '123456' && selectedEntry) {
      setRevealedPasswords(prev => new Set([...prev, selectedEntry.id]));
      setIsOTPOpen(false);
      toast.success('Password revealed', { description: 'Access has been logged' });
    } else {
      toast.error('Invalid OTP');
    }
  };

  const handleCopyPassword = (entry: VaultEntry) => {
    // In real app, this would copy the actual decrypted password
    navigator.clipboard.writeText('ActualPassword123!');
    toast.success('Password copied to clipboard');
  };

  const filteredEntries = entries.filter(e =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Password Vault</h1>
          <p className="text-muted-foreground">Securely store and manage credentials</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="btn-glow">
          <Plus className="h-4 w-4 mr-2" />
          Add Credential
        </Button>
      </div>

      {/* Security Notice */}
      <Card className="border-warning/50 bg-warning/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <p className="font-medium text-warning">Security Notice</p>
              <p className="text-sm text-muted-foreground">
                All credential access is logged and requires OTP verification. Passwords are encrypted at rest.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card className="card-elevated">
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search credentials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Vault Table */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" />
            Stored Credentials ({entries.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Password</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Last Accessed</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map((entry) => {
                const isRevealed = revealedPasswords.has(entry.id);
                
                return (
                  <TableRow key={entry.id} className="table-row-hover">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <KeyRound className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{entry.title}</p>
                          {entry.url && (
                            <p className="text-xs text-muted-foreground">{entry.url}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{entry.username}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">
                          {isRevealed ? 'ActualPassword123!' : '••••••••••••'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={categoryColors[entry.category] || 'bg-muted text-muted-foreground'}>
                        {entry.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {entry.last_accessed ? (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(entry.last_accessed).toLocaleDateString()}
                        </div>
                      ) : (
                        'Never'
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => isRevealed ? setRevealedPasswords(prev => { prev.delete(entry.id); return new Set(prev); }) : handleRevealPassword(entry)}
                        >
                          {isRevealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopyPassword(entry)}
                          disabled={!isRevealed}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* OTP Dialog */}
      <Dialog open={isOTPOpen} onOpenChange={setIsOTPOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-warning" />
              Verify Identity
            </DialogTitle>
            <DialogDescription>
              Enter your OTP to reveal the password for "{selectedEntry?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <InputOTP value={otp} onChange={setOtp} maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <p className="text-sm text-muted-foreground">
              Demo OTP: <span className="font-mono font-bold text-primary">123456</span>
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOTPOpen(false)}>Cancel</Button>
            <Button onClick={handleVerifyOTP} disabled={otp.length !== 6}>
              Verify & Reveal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Credential Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Credential</DialogTitle>
            <DialogDescription>Add a new credential to the secure vault.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input placeholder="e.g., AWS Root Account" />
            </div>
            <div className="space-y-2">
              <Label>Username</Label>
              <Input placeholder="username or email" />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label>URL (optional)</Label>
              <Input placeholder="https://..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={() => { setIsAddOpen(false); toast.success('Credential added'); }}>
              Add to Vault
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
