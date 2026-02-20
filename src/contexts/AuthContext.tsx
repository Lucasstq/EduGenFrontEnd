import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, userService } from '../services';
import { UserProfile, LoginRequest, RegisterRequest, LoginResponse } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<LoginResponse>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const loadUser = useCallback(async () => {
    if (authService.isAuthenticated()) {
      try {
        const profile = await userService.getProfile();
        setUser(profile);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        authService.clearTokens();
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await authService.login(data);
    authService.saveTokens(response);
    const profile = await userService.getProfile();
    setUser(profile);
    return response;
  };

  const register = async (data: RegisterRequest): Promise<void> => {
    await authService.register(data);
  };

  const logout = () => {
    authService.clearTokens();
    setUser(null);
  };

  const refreshUser = async () => {
    if (authService.isAuthenticated()) {
      try {
        const profile = await userService.getProfile();
        setUser(profile);
      } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
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

export default AuthContext;
