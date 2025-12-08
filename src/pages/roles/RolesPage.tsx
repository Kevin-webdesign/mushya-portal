import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Role, Permission } from '@/types';
import rolesData from '@/lib/mock/roles.json';
import permissionsData from '@/lib/mock/permissions.json';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Shield, Eye } from 'lucide-react';
import { RoleDetailDialog } from '@/components/roles/RoleDetailDialog';
import { toast } from 'sonner';

export function RolesPage() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions] = useState<Permission[]>(permissionsData as Permission[]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedRoles = localStorage.getItem('mushya_roles');
    if (storedRoles) {
      setRoles(JSON.parse(storedRoles));
    } else {
      setRoles(rolesData as Role[]);
      localStorage.setItem('mushya_roles', JSON.stringify(rolesData));
    }
    setIsLoading(false);
  }, []);

  const handleDeleteRole = (roleId: string) => {
    if (roleId === 'role_superadmin') {
      toast.error('Cannot delete Super Admin role');
      return;
    }
    
    const updatedRoles = roles.filter(r => r.id !== roleId);
    setRoles(updatedRoles);
    localStorage.setItem('mushya_roles', JSON.stringify(updatedRoles));
    toast.success('Role deleted successfully');
  };

  const handleViewRole = (role: Role) => {
    setSelectedRole(role);
    setIsDetailOpen(true);
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Roles</h1>
          <p className="text-muted-foreground">Manage roles and their permissions</p>
        </div>
        <Button onClick={() => navigate('/roles/new')} className="btn-glow">
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </div>

      {/* Search */}
      <Card className="card-elevated">
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Roles Table */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            All Roles ({filteredRoles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="h-4 bg-muted rounded animate-pulse w-32" /></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded animate-pulse w-48" /></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded animate-pulse w-16" /></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded animate-pulse w-24" /></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ))
              ) : filteredRoles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No roles found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRoles.map((role) => (
                  <TableRow key={role.id} className="table-row-hover">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Shield className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">{role.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">
                      {role.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{role.permissions.length} permissions</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(role.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewRole(role)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/roles/edit/${role.id}`)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteRole(role.id)}
                            className="text-destructive focus:text-destructive"
                            disabled={role.id === 'role_superadmin'}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <RoleDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        role={selectedRole}
        permissions={permissions}
      />
    </div>
  );
}
