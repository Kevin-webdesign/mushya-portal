import { Role, Permission } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, Calendar, CheckCircle } from 'lucide-react';

interface RoleDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
  permissions: Permission[];
}

export function RoleDetailDialog({
  open,
  onOpenChange,
  role,
  permissions,
}: RoleDetailDialogProps) {
  if (!role) return null;

  // Group permissions by module
  const permissionsByModule = permissions
    .filter(p => role.permissions.includes(p.key))
    .reduce((acc, perm) => {
      if (!acc[perm.module]) {
        acc[perm.module] = [];
      }
      acc[perm.module].push(perm);
      return acc;
    }, {} as Record<string, Permission[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span>{role.name}</span>
              <p className="text-sm font-normal text-muted-foreground">{role.description}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Meta info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Created {new Date(role.created_at).toLocaleDateString()}</span>
            </div>
            <Badge variant="secondary">{role.permissions.length} permissions</Badge>
          </div>

          {/* Permissions List */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Assigned Permissions</h4>
            <ScrollArea className="h-[300px] rounded-lg border border-border p-4">
              <div className="space-y-4">
                {Object.entries(permissionsByModule).map(([module, perms]) => (
                  <div key={module} className="space-y-2">
                    <h5 className="font-medium text-sm text-primary flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      {module}
                    </h5>
                    <div className="grid gap-1 ml-6">
                      {perms.map((perm) => (
                        <div
                          key={perm.key}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle className="h-3.5 w-3.5 text-success" />
                          <span>{perm.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
