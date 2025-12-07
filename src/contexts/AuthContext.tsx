import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, Role, AuthState } from '@/types';
import rolesData from '@/lib/mock/roles.json';
import usersData from '@/lib/mock/users.json';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  verifyOTP: (otp: string) => Promise<boolean>;
  can: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to get all users including registered ones
const getAllUsers = (): User[] => {
  const storedUsers = localStorage.getItem('mushya_users');
  const registeredUsers = storedUsers ? JSON.parse(storedUsers) : [];
  return [...usersData as User[], ...registeredUsers];
};

// Helper to get all roles including created ones
const getAllRoles = (): Role[] => {
  const storedRoles = localStorage.getItem('mushya_roles');
  const createdRoles = storedRoles ? JSON.parse(storedRoles) : [];
  return [...rolesData as Role[], ...createdRoles];
};

// Store passwords for registered users
const getUserPassword = (email: string): string | null => {
  const storedPasswords = localStorage.getItem('mushya_passwords');
  if (storedPasswords) {
    const passwords = JSON.parse(storedPasswords);
    return passwords[email] || null;
  }
  return null;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    role: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const [pendingUser, setPendingUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('mushya_user');
    if (storedUser) {
      const user = JSON.parse(storedUser) as User;
      const roles = getAllRoles();
      const role = roles.find(r => r.id === user.role_id) as Role;
      setState({
        user,
        role,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const allUsers = getAllUsers();
    const user = allUsers.find(u => u.email === email) as User | undefined;
    
    if (user) {
      // Check if it's the default admin user
      const isDefaultUser = (usersData as User[]).some(u => u.email === email);
      
      if (isDefaultUser && password === 'admin123') {
        setPendingUser(user);
        return true;
      }
      
      // Check registered user password
      const storedPassword = getUserPassword(email);
      if (storedPassword && storedPassword === password) {
        setPendingUser(user);
        return true;
      }
    }
    return false;
  }, []);

  const verifyOTP = useCallback(async (otp: string): Promise<boolean> => {
    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (otp === '123456' && pendingUser) {
      const roles = getAllRoles();
      const role = roles.find(r => r.id === pendingUser.role_id) as Role;
      localStorage.setItem('mushya_user', JSON.stringify(pendingUser));
      setState({
        user: pendingUser,
        role,
        isAuthenticated: true,
        isLoading: false,
      });
      setPendingUser(null);
      return true;
    }
    return false;
  }, [pendingUser]);

  const logout = useCallback(() => {
    localStorage.removeItem('mushya_user');
    setState({
      user: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const can = useCallback((permission: string): boolean => {
    if (!state.role) return false;
    return state.role.permissions.includes(permission);
  }, [state.role]);

  const hasAnyPermission = useCallback((permissions: string[]): boolean => {
    if (!state.role) return false;
    return permissions.some(p => state.role!.permissions.includes(p));
  }, [state.role]);

  const hasAllPermissions = useCallback((permissions: string[]): boolean => {
    if (!state.role) return false;
    return permissions.every(p => state.role!.permissions.includes(p));
  }, [state.role]);

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      logout,
      verifyOTP,
      can,
      hasAnyPermission,
      hasAllPermissions,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
