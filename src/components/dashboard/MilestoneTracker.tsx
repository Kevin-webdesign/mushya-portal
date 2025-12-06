import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, AlertTriangle, Target } from 'lucide-react';

interface Milestone {
  id: string;
  project: string;
  title: string;
  dueDate: string;
  progress: number;
  status: 'on_track' | 'at_risk' | 'overdue' | 'completed';
}

const mockMilestones: Milestone[] = [
  {
    id: '1',
    project: 'ERP Implementation',
    title: 'Phase 1: Requirements',
    dueDate: '2024-12-15',
    progress: 85,
    status: 'on_track',
  },
  {
    id: '2',
    project: 'Website Redesign',
    title: 'Design Approval',
    dueDate: '2024-12-10',
    progress: 100,
    status: 'completed',
  },
  {
    id: '3',
    project: 'Data Migration',
    title: 'Testing Phase',
    dueDate: '2024-12-08',
    progress: 45,
    status: 'at_risk',
  },
  {
    id: '4',
    project: 'Mobile App',
    title: 'Beta Release',
    dueDate: '2024-12-01',
    progress: 30,
    status: 'overdue',
  },
];

const getStatusConfig = (status: string) => {
  const config: Record<string, { icon: typeof CheckCircle2; color: string; label: string }> = {
    on_track: { icon: Target, color: 'text-success', label: 'On Track' },
    completed: { icon: CheckCircle2, color: 'text-primary', label: 'Completed' },
    at_risk: { icon: AlertTriangle, color: 'text-warning', label: 'At Risk' },
    overdue: { icon: Clock, color: 'text-destructive', label: 'Overdue' },
  };
  return config[status] || config.on_track;
};

export function MilestoneTracker() {
  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Upcoming Milestones</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockMilestones.map((milestone) => {
          const statusConfig = getStatusConfig(milestone.status);
          const StatusIcon = statusConfig.icon;
          
          return (
            <div key={milestone.id} className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-sm">{milestone.title}</p>
                  <p className="text-xs text-muted-foreground">{milestone.project}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      milestone.status === 'completed' ? 'border-primary/50 text-primary' :
                      milestone.status === 'at_risk' ? 'border-warning/50 text-warning' :
                      milestone.status === 'overdue' ? 'border-destructive/50 text-destructive' :
                      'border-success/50 text-success'
                    }`}
                  >
                    {statusConfig.label}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={milestone.progress} className="h-2 flex-1" />
                <span className="text-xs font-medium text-muted-foreground w-10">
                  {milestone.progress}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Due: {new Date(milestone.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
