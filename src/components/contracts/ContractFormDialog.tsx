import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, FileText, Plus, Trash2, Target, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export interface ContractMilestone {
  id: string;
  name: string;
  description: string;
  due_date: string;
  amount: number;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
}

export interface Contract {
  id: string;
  title: string;
  vendor: string;
  description: string;
  value: number;
  status: 'draft' | 'active' | 'completed' | 'expired' | 'terminated';
  start_date: string;
  end_date: string;
  milestones: ContractMilestone[];
  milestones_completed: number;
  total_milestones: number;
}

interface ContractFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contract: Contract | null;
  onSave: (contract: Contract) => void;
}

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'expired', label: 'Expired' },
  { value: 'terminated', label: 'Terminated' },
];

const milestoneStatusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'overdue', label: 'Overdue' },
];

export function ContractFormDialog({
  open,
  onOpenChange,
  contract,
  onSave,
}: ContractFormDialogProps) {
  const [title, setTitle] = useState('');
  const [vendor, setVendor] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<Contract['status']>('draft');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [milestones, setMilestones] = useState<ContractMilestone[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!contract;

  useEffect(() => {
    if (contract) {
      setTitle(contract.title);
      setVendor(contract.vendor);
      setDescription(contract.description || '');
      setValue(contract.value.toString());
      setStatus(contract.status);
      setStartDate(contract.start_date);
      setEndDate(contract.end_date);
      setMilestones(contract.milestones || []);
    } else {
      resetForm();
    }
  }, [contract, open]);

  const resetForm = () => {
    setTitle('');
    setVendor('');
    setDescription('');
    setValue('');
    setStatus('draft');
    setStartDate('');
    setEndDate('');
    setMilestones([]);
  };

  const addMilestone = () => {
    const newMilestone: ContractMilestone = {
      id: `milestone_${Date.now()}`,
      name: '',
      description: '',
      due_date: '',
      amount: 0,
      status: 'pending',
    };
    setMilestones([...milestones, newMilestone]);
  };

  const updateMilestone = (id: string, field: keyof ContractMilestone, value: string | number) => {
    setMilestones(milestones.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const removeMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id));
  };

  const getCompletedCount = () => {
    return milestones.filter(m => m.status === 'completed').length;
  };

  const getMilestoneProgress = () => {
    if (milestones.length === 0) return 0;
    return Math.round((getCompletedCount() / milestones.length) * 100);
  };

  const getTotalMilestoneValue = () => {
    return milestones.reduce((sum, m) => sum + (m.amount || 0), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !vendor || !value || !startDate || !endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newContract: Contract = {
      id: contract?.id || `contract_${Date.now()}`,
      title,
      vendor,
      description,
      value: parseFloat(value),
      status,
      start_date: startDate,
      end_date: endDate,
      milestones,
      milestones_completed: getCompletedCount(),
      total_milestones: milestones.length,
    };

    onSave(newContract);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {isEditing ? 'Edit Contract' : 'Create New Contract'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update contract details and milestones.' : 'Create a new contract with payment milestones.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 gap-4">
          <div className="flex-1 min-h-0 overflow-y-auto pr-2 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Contract Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., AWS Cloud Services"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor *</Label>
                <Input
                  id="vendor"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  placeholder="e.g., Amazon Web Services"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the contract terms and scope..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">Contract Value ($) *</Label>
                <Input
                  id="value"
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="100000"
                  min="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as Contract['status'])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Milestone Progress</Label>
                <div className="h-10 flex items-center gap-2">
                  <Progress value={getMilestoneProgress()} className="flex-1 h-2" />
                  <span className="text-sm text-muted-foreground">{getCompletedCount()}/{milestones.length}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Milestones Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-semibold">Payment Milestones</Label>
                  <p className="text-sm text-muted-foreground">
                    Track deliverables and payment schedules
                    {milestones.length > 0 && (
                      <span className="ml-2">
                        (Total: ${getTotalMilestoneValue().toLocaleString()})
                      </span>
                    )}
                  </p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addMilestone}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Milestone
                </Button>
              </div>

              {milestones.length === 0 ? (
                <div className="border border-dashed border-border rounded-lg p-6 text-center text-muted-foreground">
                  <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No milestones added yet. Click "Add Milestone" to define payment schedules.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {milestones.map((milestone, index) => (
                    <div key={milestone.id} className="border border-border rounded-lg p-4 bg-card/50">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2 text-muted-foreground shrink-0 pt-2">
                          {milestone.status === 'completed' ? (
                            <CheckCircle2 className="h-5 w-5 text-success" />
                          ) : (
                            <Target className="h-5 w-5" />
                          )}
                          <span className="font-mono text-sm">M{index + 1}</span>
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Milestone Name</Label>
                            <Input
                              value={milestone.name}
                              onChange={(e) => updateMilestone(milestone.id, 'name', e.target.value)}
                              placeholder="e.g., Phase 1 Delivery"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Status</Label>
                            <Select 
                              value={milestone.status} 
                              onValueChange={(v) => updateMilestone(milestone.id, 'status', v)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {milestoneStatusOptions.map(opt => (
                                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Due Date</Label>
                            <Input
                              type="date"
                              value={milestone.due_date}
                              onChange={(e) => updateMilestone(milestone.id, 'due_date', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Payment Amount ($)</Label>
                            <Input
                              type="number"
                              value={milestone.amount || ''}
                              onChange={(e) => updateMilestone(milestone.id, 'amount', parseFloat(e.target.value) || 0)}
                              placeholder="10000"
                              min="0"
                            />
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <Label>Description</Label>
                            <Textarea
                              value={milestone.description}
                              onChange={(e) => updateMilestone(milestone.id, 'description', e.target.value)}
                              placeholder="Describe what needs to be delivered..."
                              rows={2}
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="shrink-0 text-destructive hover:text-destructive"
                          onClick={() => removeMilestone(milestone.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="shrink-0 border-t pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                isEditing ? 'Update Contract' : 'Create Contract'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
