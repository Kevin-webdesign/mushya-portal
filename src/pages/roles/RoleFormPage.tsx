import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Role, Permission } from '@/types';
import rolesData from '@/lib/mock/roles.json';
import permissionsData from '@/lib/mock/permissions.json';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Loader2, Shield, Check, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export function RoleFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [permissions] = useState<Permission[]>(permissionsData as Permission[]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedRoles = localStorage.getItem('mushya_roles');
    const roles: Role[] = storedRoles ? JSON.parse(storedRoles) : rolesData;

    if (isEditing) {
      const role = roles.find(r => r.id === id);
      if (role) {
        setName(role.name);
        setDescription(role.description);
        setSelectedPermissions(role.permissions);
      } else {
        toast.error('Role not found');
        navigate('/roles');
      }
    }
    setIsLoading(false);
  }, [id, isEditing, navigate]);

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

    await new Promise(resolve => setTimeout(resolve, 500));

    const storedRoles = localStorage.getItem('mushya_roles');
    const roles: Role[] = storedRoles ? JSON.parse(storedRoles) : rolesData;

    const newRole: Role = {
      id: id || `role_${Date.now()}`,
      name,
      description,
      permissions: selectedPermissions,
      created_at: isEditing ? (roles.find(r => r.id === id)?.created_at || new Date().toISOString()) : new Date().toISOString(),
    };

    let updatedRoles: Role[];
    if (isEditing) {
      updatedRoles = roles.map(r => r.id === id ? newRole : r);
      toast.success('Role updated successfully');
    } else {
      updatedRoles = [...roles, newRole];
      toast.success('Role created successfully');
    }

    localStorage.setItem('mushya_roles', JSON.stringify(updatedRoles));
    setIsSubmitting(false);
    navigate('/roles');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/roles')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            {isEditing ? 'Edit Role' : 'Create New Role'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Modify role details and permissions' : 'Configure a new role with specific permissions'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Set the role name and description</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Role Name *</Label>
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
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of this role"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card className="card-elevated">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Permissions</CardTitle>
                <CardDescription>Select the permissions for this role</CardDescription>
              </div>
              <Badge variant="secondary" className="text-sm">
                {selectedPermissions.length} selected
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
              {Object.entries(permissionsByModule).map(([module, perms]) => (
                <div key={module} className="space-y-3 p-4 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`module-${module}`}
                      checked={isModuleFullySelected(module)}
                      onCheckedChange={() => handleToggleModule(module)}
                      className={isModulePartiallySelected(module) ? 'data-[state=checked]:bg-primary/50' : ''}
                    />
                    <Label
                      htmlFor={`module-${module}`}
                      className="font-semibold cursor-pointer"
                    >
                      {module}
                    </Label>
                    <Badge variant="outline" className="text-xs ml-auto">
                      {perms.filter(p => selectedPermissions.includes(p.key)).length}/{perms.length}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 ml-6">
                    {perms.map((perm) => (
                      <div key={perm.key} className="flex items-start gap-2 p-2 rounded bg-background">
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
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/roles')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !name} className="btn-glow">
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
        </div>
      </form>
    </div>
  );
}
