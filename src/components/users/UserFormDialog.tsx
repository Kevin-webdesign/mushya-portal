import { useState, useEffect } from 'react';
import { User, Role, Department } from '@/types';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Loader2, User as UserIcon, Check, X } from 'lucide-react';
import departmentsData from '@/lib/mock/departments.json';

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  roles: Role[];
  onSave: (user: User) => void;
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  roles,
  onSave,
}: UserFormDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [status, setStatus] = useState('active');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);

  const isEditing = !!user;

  useEffect(() => {
    // Load departments
    const stored = localStorage.getItem('mushya_departments');
    if (stored) {
      setDepartments(JSON.parse(stored));
    } else {
      setDepartments(departmentsData as Department[]);
    }
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      // Find department id by name
      const dept = departments.find(d => d.name === user.department);
      setDepartmentId(dept?.id || '');
      // Handle both old (role_id) and new (role_ids) format
      setSelectedRoleIds(user.role_ids || [(user as any).role_id] || []);
      setStatus(user.status);
    } else {
      setName('');
      setEmail('');
      setDepartmentId('');
      setSelectedRoleIds([]);
      setStatus('active');
    }
  }, [user, open, departments]);

  const handleRoleToggle = (roleId: string) => {
    setSelectedRoleIds(prev => 
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleRemoveRole = (roleId: string) => {
    setSelectedRoleIds(prev => prev.filter(id => id !== roleId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    const selectedDept = departments.find(d => d.id === departmentId);

    const newUser: User = {
      id: user?.id || `user_${Date.now()}`,
      name,
      email,
      avatar: user?.avatar || null,
      department: selectedDept?.name || '',
      role_ids: selectedRoleIds,
      status: status as 'active' | 'inactive' | 'suspended',
      last_login: user?.last_login || new Date().toISOString(),
      created_at: user?.created_at || new Date().toISOString(),
    };

    onSave(newUser);
    setIsSubmitting(false);
  };

  const getSelectedRoleNames = () => {
    return selectedRoleIds.map(id => roles.find(r => r.id === id)?.name).filter(Boolean);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-primary" />
            {isEditing ? 'Edit User' : 'Add New User'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Modify user details and role assignments.'
              : 'Add a new user to the system.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@mushyagroup.com"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={departmentId} onValueChange={setDepartmentId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Multi-role selection */}
          <div className="space-y-2">
            <Label>Roles (select multiple)</Label>
            {selectedRoleIds.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedRoleIds.map(roleId => {
                  const role = roles.find(r => r.id === roleId);
                  return role ? (
                    <Badge key={roleId} variant="secondary" className="flex items-center gap-1">
                      {role.name}
                      <button
                        type="button"
                        onClick={() => handleRemoveRole(roleId)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ) : null;
                })}
              </div>
            )}
            <ScrollArea className="h-[150px] border rounded-md p-2">
              <div className="space-y-2">
                {roles.map(role => (
                  <div
                    key={role.id}
                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleRoleToggle(role.id)}
                  >
                    <Checkbox
                      id={`role-${role.id}`}
                      checked={selectedRoleIds.includes(role.id)}
                      onCheckedChange={() => handleRoleToggle(role.id)}
                    />
                    <div className="flex-1">
                      <label htmlFor={`role-${role.id}`} className="font-medium cursor-pointer">
                        {role.name}
                      </label>
                      <p className="text-xs text-muted-foreground">{role.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <p className="text-xs text-muted-foreground">
              User will have combined permissions from all assigned roles
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !name || !email || !departmentId || selectedRoleIds.length === 0}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  {isEditing ? 'Update User' : 'Add User'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
