'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAppointment } from '@/hooks/useAppointment';
import { useRouter } from 'next/navigation';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CalendarPage() {
  const { user } = useAuth();
  const { appointments, allAppointments, createAppointment, isLoading, error } = useAppointment();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasAppointment, setHasAppointment] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [time, setTime] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (appointments.length > 0) {
      setHasAppointment(true);
    }
  }, [user, appointments, router]);

  const handleDateClick = (info: { date: Date }) => {
    if (hasAppointment) return;
    setSelectedDate(info.date);
    setTime('');
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !time) return;

    const isDuplicate = allAppointments.some(
      (appt) =>
        appt.date.getTime() === selectedDate.getTime() &&
        appt.time === time
    );
    if (isDuplicate) {
      alert('Este horário já foi escolhido por outro usuário. Escolha outro!');
      return;
    }

    try {
      await createAppointment(selectedDate, time, user?.name || 'Anônimo');
      setIsDialogOpen(false);
      setSelectedDate(null);
      setTime('');
    } catch (err) {
      console.error('Erro ao criar agendamento:', err);
    }
  };

  const validateTime = (value: string) => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(value);
  };

  const events = allAppointments.map((appt) => ({
    id: appt.id,
    title: `${appt.userName} - ${appt.time}`,
    start: new Date(
      appt.date.getFullYear(),
      appt.date.getMonth(),
      appt.date.getDate(),
      parseInt(appt.time.split(':')[0]),
      parseInt(appt.time.split(':')[1])
    ),
    allDay: false,
  }));

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen p-4 bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto w-full max-w-5xl flex flex-col lg:flex-row gap-6">
        {/* Calendário à esquerda */}
        <Card className="w-full lg:w-2/3 shadow-xl" data-aos="fade-right" data-aos-delay="100">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Escolha Sua Data</CardTitle>
          </CardHeader>
          <CardContent>
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              locale="pt-br"
              events={events}
              dateClick={handleDateClick}
              validRange={{
                start: '2025-06-01',
                end: '2025-06-21',
              }}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: '',
              }}
              height="auto"
              eventContent={(eventInfo) => (
                <div className="flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  <span>{eventInfo.event.title}</span>
                </div>
              )}
              className="bg-white dark:bg-gray-800 rounded-lg"
            />
            {hasAppointment ? (
              <p className="text-lg mt-4 text-center" data-aos="fade-up" data-aos-delay="200">
                Você já fez seu palpite! Veja os palpites de todos acima.
              </p>
            ) : (
              <p className="text-lg mt-4 text-center" data-aos="fade-up" data-aos-delay="200">
                Clique em uma data para fazer seu palpite!
              </p>
            )}
            {error && (
              <p className="text-red-500 mt-4 text-center" data-aos="fade-in" data-aos-delay="300">
                {error}
              </p>
            )}
          </CardContent>
        </Card>
        {/* Texto à direita */}
        <Card className="w-full lg:w-1/3 shadow-xl" data-aos="fade-left" data-aos-delay="100">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Bem-vindo ao Jogo do Arthurzinho!</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Olá, tudo incrível por aí? 😊 <br />
              Estou super animado porque logo serei papai! 🎉 O Arthurzinho está a caminho, e quero compartilhar essa alegria com você de um jeito especial. Como forma de agradecimento pelo apoio incrível que tenho recebido, preparei uma brincadeira divertida: <strong>adivinhe o dia e o horário que o Arthurzinho vai nascer!</strong> <br /><br />
              A previsão é que ele chegue até <strong>20 de junho</strong>. Cada participante tem <strong>uma chance</strong> de escolher um dia e horário. Quem acertar (ou chegar mais perto) vai ganhar uma <strong>surpresa especial</strong>! 💝 <br /><br />
              Vamos juntos celebrar esse momento único? Faça seu palpite e venha curtir essa aventura com a gente!
            </p>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} data-aos="zoom-in" data-aos-delay="100">
        <DialogContent className="shadow-xl">
          <DialogHeader>
            <DialogTitle>Escolha Seu Palpite</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4" data-aos="fade-up" data-aos-delay="200">
            <div>
              <Label>Data Selecionada</Label>
              <Input
                value={selectedDate ? format(selectedDate, 'PPP', { locale: ptBR }) : ''}
                readOnly
                className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="time">Horário (HH:mm)</Label>
              <Input
                id="time"
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Ex.: 14:30"
                required
                pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
                title="Formato: HH:mm (ex.: 14:30)"
                className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={isLoading || !selectedDate || !validateTime(time)}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                {isLoading ? 'Carregando...' : 'Enviar Palpite'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}