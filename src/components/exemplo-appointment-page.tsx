"use client"; 


import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAppointment } from "@/hooks/useAppointment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/shared/date-picker";
import { TimeSelector } from "@/components/TimeSelector";
import { formatDate } from "@/types/utils";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";

export default function AppointmentPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { createAppointment } = useAppointment();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Redirecionar se não estiver autenticado
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !user) return;
    
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      await createAppointment(selectedDate, selectedTime);
      
      setMessage({
        type: 'success',
        text: `Seu horário foi agendado para ${formatDate(selectedDate)} às ${selectedTime}.`
      });
      
      // Opcional: redirecionar após sucesso
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
      
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || "Não foi possível realizar o agendamento."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return <div className="flex min-h-screen items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/dashboard" className="mr-4">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Agendar Horário</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Selecione uma data e horário</CardTitle>
            <CardDescription>
              Os horários disponíveis são de 2 em 2 horas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {message && (
              <div className={`p-3 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {message.text}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Data</label>
              <DatePicker 
                date={selectedDate} 
                setDate={setSelectedDate} 
              />
            </div>
            
            {selectedDate && (
              <TimeSelector
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onSelectTime={setSelectedTime}
              />
            )}
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              disabled={!selectedDate || !selectedTime || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Confirmando..." : "Confirmar Agendamento"}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
