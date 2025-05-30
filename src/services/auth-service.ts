// auth-service.ts
// Serviço de autenticação com simulação de persistência local

import { User, UserCredentials, RegisterData } from "./tipos-auth";

// Simulação de banco de dados local usando localStorage
const USERS_KEY = "calendar_users";
const CURRENT_USER_KEY = "calendar_current_user";

// Funções auxiliares para manipulação do localStorage
const getUsers = (): User[] => {
  if (typeof window === "undefined") return [];
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

const saveUsers = (users: User[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

const saveCurrentUser = (user: User | null): void => {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

// Serviço de autenticação
export const authService = {
  // Registrar novo usuário
  register: async (data: RegisterData): Promise<User> => {
    // Simulação de delay de rede
    await new Promise((resolve) => setTimeout(resolve, 500));

    const users = getUsers();
    
    // Verificar se o email já está em uso
    if (users.some(user => user.email === data.email)) {
      throw new Error("Este email já está em uso");
    }
    
    // Verificar se as senhas coincidem
    if (data.password !== data.confirmPassword) {
      throw new Error("As senhas não coincidem");
    }

    // Criar novo usuário
    const newUser: User = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      name: data.name,
      email: data.email,
      createdAt: new Date()
    };

    // Salvar usuário (em um cenário real, a senha seria hasheada)
    users.push({...newUser, password: data.password} as any);
    saveUsers(users);
    saveCurrentUser(newUser);

    return newUser;
  },

  // Login de usuário
  login: async (credentials: UserCredentials): Promise<User> => {
    // Simulação de delay de rede
    await new Promise((resolve) => setTimeout(resolve, 500));

    const users = getUsers();
    
    // Buscar usuário pelo email e senha
    const user = users.find(
      (u: any) => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error("Email ou senha inválidos");
    }

    // Remover senha antes de retornar o usuário
    const { password, ...userWithoutPassword } = user as any;
    saveCurrentUser(userWithoutPassword);

    return userWithoutPassword;
  },

  // Logout de usuário
  logout: async (): Promise<void> => {
    // Simulação de delay de rede
    await new Promise((resolve) => setTimeout(resolve, 300));
    saveCurrentUser(null);
  },

  // Verificar se o usuário está autenticado
  isAuthenticated: (): boolean => {
    return !!getCurrentUser();
  },

  // Obter usuário atual
  getCurrentUser: (): User | null => {
    return getCurrentUser();
  }
};
