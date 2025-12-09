export interface Permission {
  key: string;
  description: string;
  module: string;
}

export interface Department {
  id: string;
  name: string;
  created_at: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  role_ids: string[]; // Changed from role_id to role_ids for multi-role support
  department: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  last_login: string;
}

export interface AuthState {
  user: User | null;
  roles: Role[]; // Changed from single role to array of roles
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface RevenueEntry {
  id: string;
  source: string;
  amount: number;
  date: string;
  description: string;
  allocated: boolean;
  created_by: string;
  created_at: string;
}

export interface Pool {
  id: string;
  name: string;
  description: string;
  percentage: number;
  balance: number;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface Budget {
  id: string;
  department: string;
  fiscal_year: string;
  amount: number;
  status: 'draft' | 'pending_finance' | 'pending_md' | 'pending_board' | 'approved' | 'rejected';
  created_by: string;
  created_at: string;
}

export interface Disbursement {
  id: string;
  title: string;
  amount: number;
  department: string;
  requestor: string;
  status: 'pending' | 'dept_approved' | 'finance_validated' | 'coo_approved' | 'md_approved' | 'paid' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  proof_url?: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  budget: number;
  spent: number;
  status: 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  start_date: string;
  end_date: string;
  phases: ProjectPhase[];
}

export interface ProjectPhase {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  delay_reason?: string;
  start_date: string;
  end_date: string;
}

export interface Contract {
  id: string;
  title: string;
  vendor: string;
  value: number;
  status: 'draft' | 'active' | 'completed' | 'expired' | 'terminated';
  start_date: string;
  end_date: string;
  milestones: ContractMilestone[];
}

export interface ContractMilestone {
  id: string;
  title: string;
  due_date: string;
  amount: number;
  status: 'pending' | 'completed' | 'overdue';
}

export interface VaultEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  category: string;
  created_by: string;
  created_at: string;
  last_accessed?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  module: string;
  user_id: string;
  user_name: string;
  details: string;
  ip_address: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  permission: string;
  children?: SidebarItem[];
}
