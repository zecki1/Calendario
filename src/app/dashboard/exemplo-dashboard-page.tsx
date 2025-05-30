"use client"; 


import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAppointment } from "@/hooks/useAppointment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/types/utils";
import { Appointment } from "@/types/tipos-auth";
import Link from "next/link";
import { Calendar, Clock, LogOut, Plus } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { appointments, isLoading, cancelAppointment, refreshAppointments } = useAppointment();
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    refreshAppointments();
  }, [refreshAppointments]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleCancelAppointment = async (id: string) => {
    setCancelingId(id);
    try {
      await cancelAppointment(id);
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
    } finally {
      setCancelingId(null);
    }
  };

  // Agrupar agendamentos por status
  const pendingAppointments = appointments.filter(app => app.status === 'pending');
  const confirmedAppointments = appointments.filter(app => app.status === 'confirmed');
  const cancelledAppointments = appointments.filter(app => app.status === 'cancelled');

  // Verificar se tem agendamentos futuros (pendentes ou confirmados)
  const hasFutureAppointments = pendingAppointments.length > 0 || confirmedAppointments.length > 0;

  if (!isAuthenticated) {
    return <div className="flex min-h-screen items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Sistema de Agendamento</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Olá, {user?.name}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Meus Agendamentos</h2>
          <Button asChild>
            <Link href="/appointment">
              <Plus className="h-4 w-4 mr-2" />
              Novo Agendamento
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <p>Carregando agendamentos...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {!hasFutureAppointments && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Você não possui agendamentos ativos.</p>
                <Button asChild>
                  <Link href="/appointment">Agendar Horário</Link>
                </Button>
              </div>
            )}

            {pendingAppointments.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Agendamentos Pendentes</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {pendingAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onCancel={handleCancelAppointment}
                      isCanceling={cancelingId === appointment.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {confirmedAppointments.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Agendamentos Confirmados</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {confirmedAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onCancel={handleCancelAppointment}
                      isCanceling={cancelingId === appointment.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {cancelledAppointments.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Agendamentos Cancelados</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {cancelledAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      showCancelButton={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel?: (id: string) => void;
  isCanceling?: boolean;
  showCancelButton?: boolean;
}

function AppointmentCard({ 
  appointment, 
  onCancel, 
  isCanceling = false,
  showCancelButton = true 
}: AppointmentCardProps) {
  const date = new Date(appointment.date);
  
  // Determinar a variante do card com base no status
  let variant: "default" | "destructive" | "success" = "default";
  if (appointment.status === 'cancelled') {
    variant = "destructive";
  } else if (appointment.status === 'confirmed') {
    variant = "success";
  }

  return (
    <Card variant={variant}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          {formatDate(date)}
        </CardTitle>
        <CardDescription className="flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          {appointment.time}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Status:</p>
            <p className="text-sm">
              {appointment.status === 'pending' && 'Pendente'}
              {appointment.status === 'confirmed' && 'Confirmado'}
              {appointment.status === 'cancelled' && 'Cancelado'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Criado em:</p>
            <p className="text-sm">{formatDate(new Date(appointment.createdAt))}</p>
          </div>
        </div>
      </CardContent>
      {showCancelButton && appointment.status !== 'cancelled' && (
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => onCancel?.(appointment.id)}
            disabled={isCanceling}
          >
            {isCanceling ? "Cancelando..." : "Cancelar Agendamento"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
