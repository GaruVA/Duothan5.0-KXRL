import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { authAPI } from '../api/auth';

interface Team {
  id: string;
  teamName: string;
  email: string;
  members: Array<{
    name: string;
    email: string;
  }>;
}

interface AuthContextType {
  user: Team | null;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; data?: any; error?: string }>;
  register: (teamData: RegisterData) => Promise<{ success: boolean; data?: any; error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  teamName: string;
  email: string;
  password: string;
  members?: Array<{
    name: string;
    email: string;
  }>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const response = await authAPI.getMe();
          setUser(response.team);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('teamData');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      const response = await authAPI.login(credentials);
      
      // Store token and user data
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('teamData', JSON.stringify(response.team));
      
      setUser(response.team);
      return { success: true, data: response };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (teamData: RegisterData) => {
    try {
      setError(null);
      const response = await authAPI.register(teamData);
      
      // Store token and user data
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('teamData', JSON.stringify(response.team));
      
      setUser(response.team);
      return { success: true, data: response };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem('authToken');
      localStorage.removeItem('teamData');
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
    error,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
