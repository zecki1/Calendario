'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/ThemeProvider';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-background dark:bg-background transition-colors">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold text-foreground dark:text-foreground">
          Template Next.js Escalável
        </h1>
        <p className="text-lg text-muted-foreground dark:text-muted-foreground">
          Este é um template base para iniciar seus projetos Next.js.
        </p>
        <Button
          onClick={toggleTheme}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 rounded-md border border-input"
        >
          {theme === 'light' ? (
            <>
              <Moon className="h-5 w-5" />
              <span>Dark Mode</span>
            </>
          ) : (
            <>
              <Sun className="h-5 w-5" />
              <span>Light Mode</span>
            </>
          )}
        </Button>
      </div>
    </main>
  );
}