import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Search, FolderKanban, Calendar, DollarSign, AlertTriangle, Pencil, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { ProjectFormDialog, Project, ProjectPhase } from '@/components/projects/ProjectFormDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const STORAGE_KEY = 'mushya_projects';

const defaultProjects: Project[] = [
  { 
    id: '1', 
    name: 'ERP Implementation', 
    client: 'Internal',
    description: 'Enterprise resource planning system implementation',
    budget: 500000, 
    spent: 320000, 
    status: 'in_progress', 
    start_date: '2024-01-15', 
    end_date: '2024-12-31', 
    progress: 65, 
    delays: 2,
    phases: [
      { id: 'p1', name: 'Requirements', description: '', status: 'completed', start_date: '2024-01-15', end_date: '2024-02-28' },
      { id: 'p2', name: 'Development', description: '', status: 'in_progress', start_date: '2024-03-01', end_date: '2024-08-31' },
      { id: 'p3', name: 'Testing', description: '', status: 'pending', start_date: '2024-09-01', end_date: '2024-11-30' },
      { id: 'p4', name: 'Deployment', description: '', status: 'pending', start_date: '2024-12-01', end_date: '2024-12-31' },
    ]
  },
  { 
    id: '2', 
    name: 'Website Redesign', 
    client: 'External - TechCorp',
    description: 'Complete website overhaul with modern design',
    budget: 150000, 
    spent: 142000, 
    status: 'completed', 
    start_date: '2024-03-01', 
    end_date: '2024-10-30', 
    progress: 100, 
    delays: 0,
    phases: []
  },
  { 
    id: '3', 
    name: 'Mobile App Development', 
    client: 'External - RetailMax',
    description: 'iOS and Android mobile application',
    budget: 250000, 
    spent: 180000, 
    status: 'in_progress', 
    start_date: '2024-06-01', 
    end_date: '2025-03-31', 
    progress: 72, 
    delays: 1,
    phases: []
  },
];

const statusConfig: Record<string, { color: string; label: string }> = {
  planning: { color: 'bg-info/10 text-info border-info/30', label: 'Planning' },
  in_progress: { color: 'bg-primary/10 text-primary border-primary/30', label: 'In Progress' },
  on_hold: { color: 'bg-warning/10 text-warning border-warning/30', label: 'On Hold' },
  completed: { color: 'bg-success/10 text-success border-success/30', label: 'Completed' },
  cancelled: { color: 'bg-destructive/10 text-destructive border-destructive/30', label: 'Cancelled' },
};

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [viewProject, setViewProject] = useState<Project | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setProjects(JSON.parse(stored));
    } else {
      setProjects(defaultProjects);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProjects));
    }
  }, []);

  const saveProjects = (updated: Project[]) => {
    setProjects(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleSaveProject = (project: Project) => {
    let updated: Project[];
    if (selectedProject) {
      updated = projects.map(p => p.id === project.id ? project : p);
      toast.success('Project updated successfully');
    } else {
      updated = [...projects, project];
      toast.success('Project created successfully');
    }
    saveProjects(updated);
    setIsFormOpen(false);
    setSelectedProject(null);
  };

  const handleDeleteProject = () => {
    if (!deleteProjectId) return;
    const updated = projects.filter(p => p.id !== deleteProjectId);
    saveProjects(updated);
    toast.success('Project deleted successfully');
    setDeleteProjectId(null);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsFormOpen(true);
  };

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);
  const activeProjects = projects.filter(p => p.status === 'in_progress').length;
  const delayedProjects = projects.filter(p => p.delays > 0).length;

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Track project progress, phases, and profitability</p>
        </div>
        <Button onClick={() => { setSelectedProject(null); setIsFormOpen(true); }} className="btn-glow">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Projects</p>
              <p className="text-2xl font-bold">{activeProjects}</p>
            </div>
            <FolderKanban className="h-8 w-8 text-primary opacity-50" />
          </div>
        </Card>
        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="text-2xl font-bold">${(totalBudget / 1000).toFixed(0)}K</p>
            </div>
            <DollarSign className="h-8 w-8 text-success opacity-50" />
          </div>
        </Card>
        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold">${(totalSpent / 1000).toFixed(0)}K</p>
            </div>
            <Progress value={(totalSpent / totalBudget) * 100} className="w-16 h-2" />
          </div>
        </Card>
        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Delayed</p>
              <p className="text-2xl font-bold">{delayedProjects}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-warning opacity-50" />
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="card-elevated">
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => {
          const budgetUsage = Math.round((project.spent / project.budget) * 100);
          const profitability = project.budget - project.spent;
          
          return (
            <Card key={project.id} className="card-elevated hover:border-primary/30 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{project.client}</p>
                  </div>
                  <Badge variant="outline" className={statusConfig[project.status].color}>
                    {statusConfig[project.status].label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                {/* Budget */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Budget</span>
                  <div className="text-right">
                    <p className="font-semibold">${project.budget.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{budgetUsage}% used</p>
                  </div>
                </div>

                {/* Profitability */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Remaining</span>
                  <span className={`font-semibold ${profitability > 0 ? 'text-success' : 'text-destructive'}`}>
                    ${profitability.toLocaleString()}
                  </span>
                </div>

                {/* Delays */}
                {project.delays > 0 && (
                  <div className="flex items-center gap-2 text-warning text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{project.delays} delay{project.delays > 1 ? 's' : ''} logged</span>
                  </div>
                )}

                {/* Timeline */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button variant="ghost" size="sm" className="flex-1" onClick={() => setViewProject(project)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1" onClick={() => handleEditProject(project)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteProjectId(project.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Form Dialog */}
      <ProjectFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        project={selectedProject}
        onSave={handleSaveProject}
      />

      {/* View Dialog */}
      <Dialog open={!!viewProject} onOpenChange={() => setViewProject(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-primary" />
              {viewProject?.name}
            </DialogTitle>
          </DialogHeader>
          {viewProject && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-medium">{viewProject.client}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="outline" className={statusConfig[viewProject.status].color}>
                    {statusConfig[viewProject.status].label}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="font-medium">${viewProject.budget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Spent</p>
                  <p className="font-medium">${viewProject.spent.toLocaleString()}</p>
                </div>
              </div>
              {viewProject.phases && viewProject.phases.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2">Phases</p>
                  <div className="space-y-2">
                    {viewProject.phases.map((phase, i) => (
                      <div key={phase.id} className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                        <span className="text-sm font-mono text-muted-foreground">#{i + 1}</span>
                        <span className="flex-1">{phase.name}</span>
                        <Badge variant="outline" className="text-xs">{phase.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteProjectId} onOpenChange={() => setDeleteProjectId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project and all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
