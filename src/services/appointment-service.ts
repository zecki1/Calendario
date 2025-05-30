// appointment-service.ts
// Serviço de agendamento com simulação de persistência local

import { Appointment } from "./tipos-auth";

// Simulação de banco de dados local usando localStorage
const APPOINTMENTS_KEY = "calendar_appointments";

// Funções auxiliares para manipulação do localStorage
const getAppointments = (): Appointment[] => {
  if (typeof window === "undefined") return [];
  const appointments = localStorage.getItem(APPOINTMENTS_KEY);
  return appointments ? JSON.parse(appointments) : [];
};

const saveAppointments = (appointments: Appointment[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
};

// Serviço de agendamento
export const appointmentService = {
  // Criar novo agendamento
  createAppointment: async (userId: string, date: Date, time: string): Promise<Appointment> => {
    // Simulação de delay de rede
    await new Promise((resolve) => setTimeout(resolve, 500));

    const appointments = getAppointments();
    
    // Verificar se já existe agendamento para a data e hora
    const existingAppointment = appointments.find(
      app => 
        app.date.toString().split('T')[0] === date.toString().split('T')[0] && 
        app.time === time
    );
    
    if (existingAppointment) {
      throw new Error("Este horário já está agendado");
    }

    // Criar novo agendamento
    const newAppointment: Appointment = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      userId,
      date,
      time,
      status: 'pending',
      createdAt: new Date()
    };

    // Salvar agendamento
    appointments.push(newAppointment);
    saveAppointments(appointments);

    return newAppointment;
  },

  // Obter agendamentos do usuário
  getUserAppointments: async (userId: string): Promise<Appointment[]> => {
    // Simulação de delay de rede
    await new Promise((resolve) => setTimeout(resolve, 300));

    const appointments = getAppointments();
    
    // Filtrar agendamentos do usuário
    return appointments
      .filter(app => app.userId === userId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  // Obter todos os agendamentos (para verificação de disponibilidade)
  getAllAppointments: async (): Promise<Appointment[]> => {
    // Simulação de delay de rede
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    return getAppointments();
  },

  // Verificar disponibilidade de horário
  checkAvailability: async (date: Date, time: string): Promise<boolean> => {
    // Simulação de delay de rede
    await new Promise((resolve) => setTimeout(resolve, 200));

    const appointments = getAppointments();
    
    // Verificar se já existe agendamento para a data e hora
    const existingAppointment = appointments.find(
      app => 
        app.date.toString().split('T')[0] === date.toString().split('T')[0] && 
        app.time === time
    );
    
    return !existingAppointment;
  },

  // Cancelar agendamento
  cancelAppointment: async (appointmentId: string): Promise<void> => {
    // Simulação de delay de rede
    await new Promise((resolve) => setTimeout(resolve, 400));

    const appointments = getAppointments();
    
    // Encontrar índice do agendamento
    const index = appointments.findIndex(app => app.id === appointmentId);
    
    if (index === -1) {
      throw new Error("Agendamento não encontrado");
    }
    
    // Atualizar status para cancelado
    appointments[index].status = 'cancelled';
    saveAppointments(appointments);
  },

  // Confirmar agendamento
  confirmAppointment: async (appointmentId: string): Promise<void> => {
    // Simulação de delay de rede
    await new Promise((resolve) => setTimeout(resolve, 400));

    const appointments = getAppointments();
    
    // Encontrar índice do agendamento
    const index = appointments.findIndex(app => app.id === appointmentId);
    
    if (index === -1) {
      throw new Error("Agendamento não encontrado");
    }
    
    // Atualizar status para confirmado
    appointments[index].status = 'confirmed';
    saveAppointments(appointments);
  }
};
