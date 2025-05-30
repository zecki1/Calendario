'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types/tipos-auth';
import { authService } from '@/services/auth-service';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(
      (user) => {
        setState({
          user,
          isAuthenticated: !!user,
          isLoading: false,
          error: null,
        });
      },
      (error) => {
        console.error('Erro na verificação de autenticação:', error);
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error:
            error.code === 'auth/network-request-failed'
              ? 'Falha na conexão com o servidor. Verifique sua rede ou tente novamente.'
              : error.message || 'Erro ao verificar autenticação',
        });
      }
    );
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setState({ ...state, isLoading: true, error: null });
    try {
      const user = await authService.login({ email, password });
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setState({
        ...state,
        isLoading: false,
        error:
          error.code === 'auth/network-request-failed'
            ? 'Falha na conexão com o servidor. Verifique sua rede ou tente novamente.'
            : error.message || 'Erro ao fazer login',
      });
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, confirmPassword: string) => {
    setState({ ...state, isLoading: true, error: null });
    try {
      const user = await authService.register({ name, email, password, confirmPassword });
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setState({
        ...state,
        isLoading: false,
        error:
          error.code === 'auth/network-request-failed'
            ? 'Falha na conexão com o servidor. Verifique sua rede ou tente novamente.'
            : error.message || 'Erro ao registrar usuário',
      });
      throw error;
    }
  };

  const logout = async () => {
    setState({ ...state, isLoading: true });
    try {
      await authService.logout();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setState({
        ...state,
        isLoading: false,
        error:
          error.code === 'auth/network-request-failed'
            ? 'Falha na conexão com o servidor. Verifique sua rede ou tente novamente.'
            : error.message || 'Erro ao fazer logout',
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('useAuth chamado fora de um AuthProvider. Stack:', new Error().stack);
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}