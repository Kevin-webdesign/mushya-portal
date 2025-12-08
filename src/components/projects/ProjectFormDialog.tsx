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
import { Loader2, FolderKanban, Plus, Trash2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

export interface ProjectPhase {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  start_date: string;
  end_date: string;
  delay_reason?: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  description: string;
  budget: number;
  spent: number;
  status: 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  start_date: string;
  end_date: string;
  progress: number;
  delays: number;
  phases: ProjectPhase[];
}

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  onSave: (project: Project) => void;
}

const statusOptions = [
  { value: 'planning', label: 'Planning' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const phaseStatusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'delayed', label: 'Delayed' },
];

export function ProjectFormDialog({
  open,
  onOpenChange,
  project,
  onSave,
}: ProjectFormDialogProps) {
  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [status, setStatus] = useState<Project['status']>('planning');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [phases, setPhases] = useState<ProjectPhase[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!project;

  useEffect(() => {
    if (project) {
      setName(project.name);
      setClient(project.client);
      setDescription(project.description || '');
      setBudget(project.budget.toString());
      setStatus(project.status);
      setStartDate(project.start_date);
      setEndDate(project.end_date);
      setPhases(project.phases || []);
    } else {
      resetForm();
    }
  }, [project, open]);

  const resetForm = () => {
    setName('');
    setClient('');
    setDescription('');
    setBudget('');
    setStatus('planning');
    setStartDate('');
    setEndDate('');
    setPhases([]);
  };

  const addPhase = () => {
    const newPhase: ProjectPhase = {
      id: `phase_${Date.now()}`,
      name: '',
      description: '',
      status: 'pending',
      start_date: '',
      end_date: '',
    };
    setPhases([...phases, newPhase]);
  };

  const updatePhase = (id: string, field: keyof ProjectPhase, value: string) => {
    setPhases(phases.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const removePhase = (id: string) => {
    setPhases(phases.filter(p => p.id !== id));
  };

  const calculateProgress = () => {
    if (phases.length === 0) return 0;
    const completed = phases.filter(p => p.status === 'completed').length;
    return Math.round((completed / phases.length) * 100);
  };

  const countDelays = () => {
    return phases.filter(p => p.status === 'delayed').length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !client || !budget || !startDate || !endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newProject: Project = {
      id: project?.id || `project_${Date.now()}`,
      name,
      client,
      description,
      budget: parseFloat(budget),
      spent: project?.spent || 0,
      status,
      start_date: startDate,
      end_date: endDate,
      progress: calculateProgress(),
      delays: countDelays(),
      phases,
    };

    onSave(newProject);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-primary" />
            {isEditing ? 'Edit Project' : 'Create New Project'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update project details and manage phases.' : 'Create a new project with phases and milestones.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 gap-4">
          <div className="flex-1 min-h-0 overflow-y-auto pr-2 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., ERP Implementation"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client">Client *</Label>
                <Input
                  id="client"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="e.g., Internal or Client Name"
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
                placeholder="Describe the project scope and objectives..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget ($) *</Label>
                <Input
                  id="budget"
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="100000"
                  min="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as Project['status'])}>
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
                <Label>Progress</Label>
                <div className="h-10 flex items-center">
                  <Badge variant="secondary">{calculateProgress()}% complete</Badge>
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

            {/* Phases Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-semibold">Project Phases</Label>
                  <p className="text-sm text-muted-foreground">Define project milestones and track progress</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addPhase}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Phase
                </Button>
              </div>

              {phases.length === 0 ? (
                <div className="border border-dashed border-border rounded-lg p-6 text-center text-muted-foreground">
                  <FolderKanban className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No phases added yet. Click "Add Phase" to create project milestones.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {phases.map((phase, index) => (
                    <div key={phase.id} className="border border-border rounded-lg p-4 bg-card/50">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2 text-muted-foreground shrink-0 pt-2">
                          <GripVertical className="h-4 w-4" />
                          <span className="font-mono text-sm">#{index + 1}</span>
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Phase Name</Label>
                            <Input
                              value={phase.name}
                              onChange={(e) => updatePhase(phase.id, 'name', e.target.value)}
                              placeholder="e.g., Requirements Gathering"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Status</Label>
                            <Select 
                              value={phase.status} 
                              onValueChange={(v) => updatePhase(phase.id, 'status', v)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {phaseStatusOptions.map(opt => (
                                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input
                              type="date"
                              value={phase.start_date}
                              onChange={(e) => updatePhase(phase.id, 'start_date', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>End Date</Label>
                            <Input
                              type="date"
                              value={phase.end_date}
                              onChange={(e) => updatePhase(phase.id, 'end_date', e.target.value)}
                            />
                          </div>
                          {phase.status === 'delayed' && (
                            <div className="md:col-span-2 space-y-2">
                              <Label>Delay Reason</Label>
                              <Textarea
                                value={phase.delay_reason || ''}
                                onChange={(e) => updatePhase(phase.id, 'delay_reason', e.target.value)}
                                placeholder="Explain the reason for delay..."
                                rows={2}
                              />
                            </div>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="shrink-0 text-destructive hover:text-destructive"
                          onClick={() => removePhase(phase.id)}
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
                isEditing ? 'Update Project' : 'Create Project'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
