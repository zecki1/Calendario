'use client';

import { ThemeProvider } from '@/lib/ThemeProvider';
import { AuthProvider } from '@/hooks/useAuth';
import { AppointmentProvider } from '@/hooks/useAppointment';
import '@/styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ThemeProvider>
          <AuthProvider>
            <AppointmentProvider>
              {children}
            </AppointmentProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}