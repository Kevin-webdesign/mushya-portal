import { useState, useEffect } from 'react';
import { Role, Permission } from '@/types';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Loader2, Shield, Check } from 'lucide-react';

interface RoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
  permissions: Permission[];
  onSave: (role: Role) => void;
}

export function RoleFormDialog({
  open,
  onOpenChange,
  role,
  permissions,
  onSave,
}: RoleFormDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!role;

  useEffect(() => {
    if (role) {
      setName(role.name);
      setDescription(role.description);
      setSelectedPermissions(role.permissions);
    } else {
      setName('');
      setDescription('');
      setSelectedPermissions([]);
    }
  }, [role, open]);

  // Group permissions by module
  const permissionsByModule = permissions.reduce((acc, perm) => {
    if (!acc[perm.module]) {
      acc[perm.module] = [];
    }
    acc[perm.module].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  const handleTogglePermission = (permKey: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permKey)
        ? prev.filter(p => p !== permKey)
        : [...prev, permKey]
    );
  };

  const handleToggleModule = (module: string) => {
    const modulePerms = permissionsByModule[module].map(p => p.key);
    const allSelected = modulePerms.every(p => selectedPermissions.includes(p));
    
    if (allSelected) {
      setSelectedPermissions(prev => prev.filter(p => !modulePerms.includes(p)));
    } else {
      setSelectedPermissions(prev => [...new Set([...prev, ...modulePerms])]);
    }
  };

  const isModuleFullySelected = (module: string) => {
    const modulePerms = permissionsByModule[module].map(p => p.key);
    return modulePerms.every(p => selectedPermissions.includes(p));
  };

  const isModulePartiallySelected = (module: string) => {
    const modulePerms = permissionsByModule[module].map(p => p.key);
    const selectedCount = modulePerms.filter(p => selectedPermissions.includes(p)).length;
    return selectedCount > 0 && selectedCount < modulePerms.length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const newRole: Role = {
      id: role?.id || `role_${Date.now()}`,
      name,
      description,
      permissions: selectedPermissions,
      created_at: role?.created_at || new Date().toISOString(),
    };

    onSave(newRole);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {isEditing ? 'Edit Role' : 'Create New Role'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Modify the role details and permissions.'
              : 'Create a new role with specific permissions.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 gap-4">
          <div className="grid grid-cols-1 gap-4 shrink-0">
            <div className="space-y-2">
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Department Manager"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this role's responsibilities..."
                rows={2}
              />
            </div>
          </div>

          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between mb-2 shrink-0">
              <Label>Permissions</Label>
              <Badge variant="secondary">{selectedPermissions.length} selected</Badge>
            </div>
            
            <div className="flex-1 overflow-y-auto rounded-lg border border-border p-4">
              <div className="space-y-4">
                {Object.entries(permissionsByModule).map(([module, perms]) => (
                  <div key={module} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`module-${module}`}
                        checked={isModuleFullySelected(module)}
                        onCheckedChange={() => handleToggleModule(module)}
                        className={isModulePartiallySelected(module) ? 'data-[state=checked]:bg-primary/50' : ''}
                      />
                      <Label
                        htmlFor={`module-${module}`}
                        className="font-semibold text-sm cursor-pointer"
                      >
                        {module}
                      </Label>
                      <Badge variant="outline" className="text-xs">
                        {perms.filter(p => selectedPermissions.includes(p.key)).length}/{perms.length}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-6">
                      {perms.map((perm) => (
                        <div key={perm.key} className="flex items-start gap-2">
                          <Checkbox
                            id={perm.key}
                            checked={selectedPermissions.includes(perm.key)}
                            onCheckedChange={() => handleTogglePermission(perm.key)}
                          />
                          <div className="grid gap-0.5">
                            <Label
                              htmlFor={perm.key}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {perm.description}
                            </Label>
                            <span className="text-xs text-muted-foreground font-mono">
                              {perm.key}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="shrink-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !name}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  {isEditing ? 'Update Role' : 'Create Role'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
