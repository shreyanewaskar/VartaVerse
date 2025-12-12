import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TokenManager, logger } from '../lib/api-client';
import { userApi } from '../lib/user-api';
import { User, LoginRequest, RegisterRequest } from '../lib/types';
import { useToast } from './use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const isAuthenticated = !!user && !!TokenManager.getToken();

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const token = TokenManager.getToken();
      const savedUser = TokenManager.getUser();

      if (token && savedUser) {
        try {
          logger.info('Validating existing session');
          const currentUser = await userApi.getMe();
          setUser(currentUser);
          TokenManager.setUser(currentUser);
          logger.info('Session validated successfully');
        } catch (error) {
          logger.error('Session validation failed', error);
          TokenManager.removeToken();
          toast({
            title: 'Session Expired',
            description: 'Please log in again',
            variant: 'destructive',
          });
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [toast]);

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      logger.info('Starting login process');
      
      const response = await userApi.login(credentials);
      TokenManager.setToken(response.jwtToken);
      
      // Create user object from login response
      const userFromLogin = {
        id: response.userId.toString(),
        name: response.userName,
        email: credentials.email,
        role: 'user' // Default role
      };
      
      setUser(userFromLogin);
      TokenManager.setUser(userFromLogin);
      
      logger.info('Login successful', { userId: response.userId });
      toast({
        title: 'Welcome back!',
        description: `Hello ${response.userName}`,
      });
    } catch (error: any) {
      logger.error('Login failed', error);
      const message = error.response?.data?.message || error.response?.data?.error || 'Login failed';
      toast({
        title: 'Login Failed',
        description: message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      setIsLoading(true);
      logger.info('Starting registration process');
      
      const registeredUser = await userApi.register(data);
      
      logger.info('Registration successful, attempting auto-login');
      
      // Auto-login after registration
      try {
        await login({ email: data.email, password: data.password });
      } catch (loginError) {
        // If auto-login fails, still show success message
        logger.info('Auto-login failed, but registration was successful');
        toast({
          title: 'Registration Successful!',
          description: 'Please login with your credentials',
        });
        return; // Exit without throwing error
      }
      
      toast({
        title: 'Welcome to VartaVerse!',
        description: 'Your account has been created successfully',
      });
    } catch (error: any) {
      logger.error('Registration failed', error);
      console.error('Full registration error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: error.config
      });
      const message = error.response?.data?.message || error.response?.data?.error || 'Registration failed';
      toast({
        title: 'Registration Failed',
        description: message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    logger.info('Logging out user');
    TokenManager.removeToken();
    setUser(null);
    toast({
      title: 'Logged Out',
      description: 'You have been logged out successfully',
    });
  };

  const refreshUser = async () => {
    try {
      logger.info('Refreshing user data');
      const currentUser = await userApi.getMe();
      setUser(currentUser);
      TokenManager.setUser(currentUser);
    } catch (error) {
      logger.error('Failed to refresh user data', error);
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

