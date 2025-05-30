// tipos-auth.ts
// Tipos para autenticação e agendamento

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends UserCredentials {
  name: string;
  confirmPassword: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Appointment {
  id: string;
  userId: string;
  date: Date;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
}
