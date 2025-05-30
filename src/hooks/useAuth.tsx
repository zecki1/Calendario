"use client"; 


import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, AuthState } from "@/types/tipos-auth";
import { authService } from "@/services/auth-service";

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
    // Verificar se o usuário está autenticado ao carregar a página
    const checkAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        setState({
          user: currentUser,
          isAuthenticated: !!currentUser,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: "Erro ao verificar autenticação",
        });
      }
    };

    checkAuth();
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
        error: error.message || "Erro ao fazer login",
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
        error: error.message || "Erro ao registrar usuário",
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
        error: error.message || "Erro ao fazer logout",
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
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
