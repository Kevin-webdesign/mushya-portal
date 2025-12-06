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
      const role = rolesData.find(r => r.id === user.role_id) as Role;
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
    
    const user = usersData.find(u => u.email === email) as User | undefined;
    if (user && password === 'admin123') {
      setPendingUser(user);
      return true; // Proceed to OTP
    }
    return false;
  }, []);

  const verifyOTP = useCallback(async (otp: string): Promise<boolean> => {
    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (otp === '123456' && pendingUser) {
      const role = rolesData.find(r => r.id === pendingUser.role_id) as Role;
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
