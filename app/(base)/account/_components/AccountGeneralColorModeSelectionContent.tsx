'use client';

import { useColorScheme } from '@mui/material/styles';

import { flushSync } from 'react-dom';
import { useRef, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, UseThemeProps } from 'next-themes';

import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useClientOnly } from '@/hooks/useClientOnly';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export default function AccountGeneralColorModeSelectionContent() {
  const isClient = useClientOnly();

  const { setTheme, theme, resolvedTheme }: UseThemeProps = useTheme();
  const { setMode } = useColorScheme();
  const clickedRef = useRef<HTMLButtonElement | null>(null);

  const selectedTheme = theme;

  // Keep MUI color scheme in sync with next-themes resolved value
  useEffect(() => {
    if (resolvedTheme === 'light' || resolvedTheme === 'dark') {
      setMode(resolvedTheme);
    }
  }, [resolvedTheme, setMode]);

  const handleThemeToggle = async (nextTheme: string) => {
    if (nextTheme !== 'light' && nextTheme !== 'dark' && nextTheme !== 'system') return;
    if (!clickedRef.current) return;

    const applyTheme = () => {
      setTheme(nextTheme);
    };

    if (!document.startViewTransition) {
      applyTheme();
      return;
    }

    await document.startViewTransition(() => {
      flushSync(() => {
        applyTheme();
      });
    }).ready;

    const { top, left, width, height } = clickedRef.current.getBoundingClientRect();
    const y = top + height / 2;
    const x = left + width / 2;
    const right = window.innerWidth - left;
    const bottom = window.innerHeight - top;
    const maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom));

    document.documentElement.animate(
      {
        clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRad}px at ${x}px ${y}px)`],
      },
      {
        duration: 700,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      },
    );
  };

  if (!isClient) {
    return <ModeSelectionSkeleton />;
  }

  return (
    <ToggleGroup
      type="single"
      value={ selectedTheme }
      onValueChange={ handleThemeToggle }
      className=".5"
      spacing={ 2 }
      size="sm"
      variant="outline"
    >
      <ToggleGroupItem
        value="light"
        aria-label="Light theme"
        className={ cn('cursor-pointer') }
        onClick={ (e) => {
          clickedRef.current = e.currentTarget;
        } }
      >
        <Sun className="text-foreground!" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="dark"
        aria-label="Dark theme"
        className={ cn('cursor-pointer') }
        onClick={ (e) => {
          clickedRef.current = e.currentTarget;
        } }
      >
        <Moon className="text-foreground!" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="system"
        aria-label="System theme"
        className={ cn('cursor-pointer') }
        onClick={ (e) => {
          clickedRef.current = e.currentTarget;
        } }
      >
        <Monitor className="text-foreground!" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

function ModeSelectionSkeleton() {
  return (
    <section className="h-8 w-[140px]">
      <Skeleton className="h-full w-full" />
    </section>
  );
}
