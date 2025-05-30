"use client"; 

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Appointment } from "@/types/tipos-auth";
import { appointmentService } from "@/services/appointment-service";
import { useAuth } from "./useAuth";

interface AppointmentContextType {
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;
  createAppointment: (date: Date, time: string) => Promise<void>;
  cancelAppointment: (appointmentId: string) => Promise<void>;
  refreshAppointments: () => Promise<void>;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const userAppointments = await appointmentService.getUserAppointments(user.id);
      setAppointments(userAppointments);
    } catch (error: any) {
      setError(error.message || "Erro ao buscar agendamentos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchAppointments();
    } else {
      setAppointments([]);
    }
  }, [isAuthenticated, user]);

  const createAppointment = async (date: Date, time: string) => {
    if (!user) throw new Error("Usuário não autenticado");

    setIsLoading(true);
    setError(null);

    try {
      await appointmentService.createAppointment(user.id, date, time);
      await fetchAppointments();
    } catch (error: any) {
      setError(error.message || "Erro ao criar agendamento");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await appointmentService.cancelAppointment(appointmentId);
      await fetchAppointments();
    } catch (error: any) {
      setError(error.message || "Erro ao cancelar agendamento");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAppointments = async () => {
    await fetchAppointments();
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        isLoading,
        error,
        createAppointment,
        cancelAppointment,
        refreshAppointments,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointment() {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error("useAppointment deve ser usado dentro de um AppointmentProvider");
  }
  return context;
}