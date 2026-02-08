/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */
'use client';

import { useColorScheme } from '@mui/material/styles';

import { useRef } from 'react';
import { flushSync } from 'react-dom';
import { useTheme, UseThemeProps } from 'next-themes';
import { Sun, Moon, SunMoon, Monitor } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useClientOnly } from '@/hooks/useClientOnly';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import Typography from '../typography/Typography';

export default function ThemeAndMoreSettingsMenuThemeSwitcher() {
  const isClient = useClientOnly();
  const { setTheme, theme, resolvedTheme }: UseThemeProps = useTheme();
  const { setMode } = useColorScheme();
  const clickedRef = useRef<HTMLButtonElement | null>(null);

  const selectedTheme = theme === 'system' ? 'system' : (resolvedTheme ?? 'light');

  const handleThemeToggle = async (nextTheme: string) => {
    if (nextTheme !== 'light' && nextTheme !== 'dark') return;
    if (!clickedRef.current) return;

    const applyTheme = () => {
      setTheme(nextTheme);
      setMode(nextTheme);
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

  return (
    <DropdownMenuItem
      onSelect={ (event) => event.preventDefault() }
      className="flex items-center justify-between gap-x-3 hover:bg-transparent! hover:text-black! dark:hover:text-white!"
    >
      <Typography variant="body1" className="flex shrink-0 items-center gap-x-2">
        <SunMoon className="size-4 hover:text-black! dark:hover:text-white!" />
        Theme
      </Typography>
      { !isClient ?
        <Skeleton className="h-8 w-28 rounded-md" />
      : <ToggleGroup
          type="single"
          value={ selectedTheme }
          onValueChange={ handleThemeToggle }
          className="rounded-lg bg-muted/40 p-0.5"
          spacing={ 2 }
          size="sm"
        >
        <ToggleGroupItem
            value="light"
            aria-label="Light theme"
            className={ cn('size-7 cursor-pointer rounded-lg p-0', {
              '': selectedTheme === 'light',
            }) }
            onClick={ (e) => {
              clickedRef.current = e.currentTarget;
            } }
          >
          <Sun className="text-foreground!" />
        </ToggleGroupItem>
        <ToggleGroupItem
            value="dark"
            aria-label="Dark theme"
            className={ cn('size-7 cursor-pointer rounded-lg p-0', {
              '': selectedTheme === 'dark',
            }) }
            onClick={ (e) => {
              clickedRef.current = e.currentTarget;
            } }
          >
          <Moon className="text-foreground!" />
        </ToggleGroupItem>
        <ToggleGroupItem
            value="system"
            aria-label="System theme"
            className={ cn('size-7 cursor-pointer rounded-lg p-0', {
              '': selectedTheme === 'system',
            }) }
            onClick={ (e) => {
              clickedRef.current = e.currentTarget;
            } }
          >
          <Monitor className="text-foreground!" />
        </ToggleGroupItem>
      </ToggleGroup>
      }
    </DropdownMenuItem>
  );
}
