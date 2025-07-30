import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser, User, UserRole } from '../types';
import { mockLogin } from '../data/mockData';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password?: string, otp?: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: string) => boolean;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token on mount
    const storedUser = localStorage.getItem('auth_user');
    const storedToken = localStorage.getItem('auth_token');
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          ...parsedUser,
          token: storedToken
        });
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password?: string, otp?: string) => {
    setIsLoading(true);
    try {
      const authUser = await mockLogin(email, password, otp);
      setUser(authUser);
      
      // Store auth data
      localStorage.setItem('auth_user', JSON.stringify({
        id: authUser.id,
        name: authUser.name,
        email: authUser.email,
        role: authUser.role,
        department: authUser.department,
        registrationNumber: authUser.registrationNumber,
        joinedDate: authUser.joinedDate,
        lastLogin: authUser.lastLogin,
        isActive: authUser.isActive,
        profileImage: authUser.profileImage
      }));
      localStorage.setItem('auth_token', authUser.token);
      
      // Update last login
      const updatedUser = {
        ...authUser,
        lastLogin: new Date().toISOString()
      };
      setUser(updatedUser);
      
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('remember_me');
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Define role-based permissions
    const permissions: Record<UserRole, string[]> = {
      doctor: [
        'view_meetings',
        'upload_pretest',
        'upload_attendance', 
        'upload_posttest',
        'view_own_progress'
      ],
      admin: [
        'create_meetings',
        'manage_meetings',
        'view_statistics',
        'generate_reports',
        'manage_users',
        'view_all_progress'
      ]
    };

    return permissions[user.role]?.includes(permission) || false;
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      
      // Update stored user data
      localStorage.setItem('auth_user', JSON.stringify({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        department: updatedUser.department,
        registrationNumber: updatedUser.registrationNumber,
        joinedDate: updatedUser.joinedDate,
        lastLogin: updatedUser.lastLogin,
        isActive: updatedUser.isActive,
        profileImage: updatedUser.profileImage
      }));
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    hasRole,
    hasPermission,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
