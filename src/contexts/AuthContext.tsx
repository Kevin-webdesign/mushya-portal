import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
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
  allPermissions: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to migrate old user format (role_ids) to new format (role_id)
const migrateUser = (user: any): User => {
  if (user.role_ids && !user.role_id) {
    return {
      ...user,
      role_id: user.role_ids[0] || '',
    };
  }
  return user;
};

// Helper to get all users including registered ones
const getAllUsers = (): User[] => {
  const storedUsers = localStorage.getItem('mushya_users');
  const registeredUsers = storedUsers ? JSON.parse(storedUsers).map(migrateUser) : [];
  const defaultUsers = (usersData as any[]).map(migrateUser);
  return [...defaultUsers, ...registeredUsers];
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
      const user = migrateUser(JSON.parse(storedUser)) as User;
      const allRoles = getAllRoles();
      const userRole = allRoles.find(r => r.id === user.role_id) || null;
      setState({
        user,
        role: userRole,
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
      const isDefaultUser = (usersData as any[]).some(u => u.email === email);
      
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
      const allRoles = getAllRoles();
      const userRole = allRoles.find(r => r.id === pendingUser.role_id) || null;
      localStorage.setItem('mushya_user', JSON.stringify(pendingUser));
      setState({
        user: pendingUser,
        role: userRole,
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

  // Get all permissions from the user's role
  const allPermissions = useMemo(() => {
    return state.role?.permissions || [];
  }, [state.role]);

  const can = useCallback((permission: string): boolean => {
    return allPermissions.includes(permission);
  }, [allPermissions]);

  const hasAnyPermission = useCallback((permissions: string[]): boolean => {
    return permissions.some(p => allPermissions.includes(p));
  }, [allPermissions]);

  const hasAllPermissions = useCallback((permissions: string[]): boolean => {
    return permissions.every(p => allPermissions.includes(p));
  }, [allPermissions]);

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      logout,
      verifyOTP,
      can,
      hasAnyPermission,
      hasAllPermissions,
      allPermissions,
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
