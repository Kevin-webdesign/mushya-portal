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

// Helper to migrate old user format (role_id) to new format (role_ids)
const migrateUser = (user: any): User => {
  if (user.role_id && !user.role_ids) {
    return {
      ...user,
      role_ids: [user.role_id],
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
    roles: [],
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
      const userRoles = allRoles.filter(r => user.role_ids.includes(r.id));
      setState({
        user,
        roles: userRoles,
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
      const userRoles = allRoles.filter(r => pendingUser.role_ids.includes(r.id));
      localStorage.setItem('mushya_user', JSON.stringify(pendingUser));
      setState({
        user: pendingUser,
        roles: userRoles,
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
      roles: [],
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  // Aggregate all permissions from all assigned roles
  const allPermissions = useMemo(() => {
    const permissions = new Set<string>();
    state.roles.forEach(role => {
      role.permissions.forEach(p => permissions.add(p));
    });
    return Array.from(permissions);
  }, [state.roles]);

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
