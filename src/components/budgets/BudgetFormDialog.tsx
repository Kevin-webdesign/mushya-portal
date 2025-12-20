import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { toast } from 'sonner';
import departmentsData from '@/lib/mock/departments.json';

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

interface BudgetFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget?: Budget | null;
  onSubmit: (budget: Budget) => void;
}

const currentYear = new Date().getFullYear();
const fiscalYears = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2].map(y => y.toString());

export function BudgetFormDialog({ open, onOpenChange, budget, onSubmit }: BudgetFormDialogProps) {
  const [formData, setFormData] = useState({
    department: '',
    fiscal_year: currentYear.toString(),
    amount: '',
    description: '',
  });

  useEffect(() => {
    if (budget) {
      setFormData({
        department: budget.department,
        fiscal_year: budget.fiscal_year,
        amount: budget.amount.toString(),
        description: budget.description || '',
      });
    } else {
      setFormData({
        department: '',
        fiscal_year: currentYear.toString(),
        amount: '',
        description: '',
      });
    }
  }, [budget, open]);

  const handleSubmit = () => {
    if (!formData.department || !formData.fiscal_year || !formData.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const newBudget: Budget = {
      id: budget?.id || Date.now().toString(),
      department: formData.department,
      fiscal_year: formData.fiscal_year,
      amount: amount,
      spent: budget?.spent || 0,
      status: budget?.status || 'draft',
      created_at: budget?.created_at || new Date().toISOString().split('T')[0],
      description: formData.description,
    };

    onSubmit(newBudget);
    onOpenChange(false);
    toast.success(budget ? 'Budget updated successfully' : 'Budget created successfully');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{budget ? 'Edit Budget' : 'Create Budget Request'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Select
              value={formData.department}
              onValueChange={(value) => setFormData({ ...formData, department: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departmentsData.map((dept) => (
                  <SelectItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fiscal_year">Fiscal Year *</Label>
            <Select
              value={formData.fiscal_year}
              onValueChange={(value) => setFormData({ ...formData, fiscal_year: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select fiscal year" />
              </SelectTrigger>
              <SelectContent>
                {fiscalYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="e.g., 150000"
              min="0"
              step="1000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description / Justification</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide a brief justification for this budget request..."
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {budget ? 'Update Budget' : 'Submit Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
