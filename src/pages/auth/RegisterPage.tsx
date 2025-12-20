import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Building2, Loader2, UserPlus, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Role, User } from '@/types';
import usersData from '@/lib/mock/users.json';
import rolesData from '@/lib/mock/roles.json';

const DEPARTMENTS = ['IT', 'Finance', 'HR', 'Operations', 'Marketing', 'Sales', 'Legal'];

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [roleId, setRoleId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Load roles from localStorage or default
    const storedRoles = localStorage.getItem('mushya_roles');
    if (storedRoles) {
      setRoles([...rolesData as Role[], ...JSON.parse(storedRoles)]);
    } else {
      setRoles(rolesData as Role[]);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if email already exists
    const storedUsers = localStorage.getItem('mushya_users');
    const registeredUsers = storedUsers ? JSON.parse(storedUsers) : [];
    const allUsers = [...usersData as User[], ...registeredUsers];
    
    const existingUser = allUsers.find(u => u.email === email);
    if (existingUser) {
      toast.error('Email already registered');
      setIsLoading(false);
      return;
    }

    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      avatar: null,
      role_id: roleId,
      department,
      status: 'active',
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
    };

    // Store user in localStorage
    registeredUsers.push(newUser);
    localStorage.setItem('mushya_users', JSON.stringify(registeredUsers));

    // Store password separately (in real app, this would be hashed on server)
    const storedPasswords = localStorage.getItem('mushya_passwords');
    const passwords = storedPasswords ? JSON.parse(storedPasswords) : {};
    passwords[email] = password;
    localStorage.setItem('mushya_passwords', JSON.stringify(passwords));

    toast.success('Registration successful!', {
      description: 'Please log in with your credentials',
    });
    
    navigate('/login');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-glow">
            <Building2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">Mushya Group</h1>
          <p className="text-muted-foreground">Internal Portal</p>
        </div>

        <Card className="card-elevated">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Create an Account</CardTitle>
            <CardDescription>
              Fill in your details to register
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="input-focus"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@mushyagroup.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-focus"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={department} onValueChange={setDepartment} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={roleId} onValueChange={setRoleId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-focus"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="input-focus"
                  required
                />
              </div>

              <Button type="submit" className="w-full btn-glow" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <UserPlus className="h-4 w-4 mr-2" />
                )}
                Register
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link 
            to="/login" 
            className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
