'use client';

import { useColorScheme } from '@mui/material/styles';

import { Sun } from 'lucide-react';
import { Moon } from 'lucide-react';
import { flushSync } from 'react-dom';
import { useRef, useState } from 'react';
import { useTheme, UseThemeProps } from 'next-themes';
import { VariantProps } from 'class-variance-authority';

import { useClientOnly } from '@/hooks/useClientOnly';
import { Button, buttonVariants } from '@/components/ui/button';

import { Skeleton } from '../ui/skeleton';

export default function ThemeToggleAnimatedButton({ ...btnProps }: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>) {
  const isClient = useClientOnly();
  const [rotationDegree, setRotationDegree] = useState(0);
  const { setTheme, theme }: UseThemeProps = useTheme();
  const [currentIcon, setCurrentIcon] = useState<'light' | 'dark'>(theme as 'light' | 'dark');
  const { setMode } = useColorScheme();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const changeTheme = async () => {
    if (!buttonRef.current) return;

    await document.startViewTransition(() => {
      flushSync(() => {
        handleOnThemeUpdate();
      });
    }).ready;

    const { top, left, width, height } = buttonRef.current.getBoundingClientRect();
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

  const handleOnThemeUpdate = () => {
    // Calculate the next rotation value
    const nextRotation = rotationDegree + 360;
    setRotationDegree(nextRotation);

    // Delay the theme change until the animation is halfway complete
    const newTheme = theme === 'light' ? 'dark' : 'light';

    setTimeout(() => {
      setTheme(newTheme);
      setMode(newTheme);
      setCurrentIcon(newTheme);
    }, 100);
  };

  // Prevent hydration mismatch by not rendering theme-dependent content until mounted
  if (!isClient) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Skeleton className="h-4 w-4 rounded-full" />
      </Button>
    );
  }

  return (
    <Button ref={ buttonRef } variant="outline" size="icon" onClick={ changeTheme } { ...btnProps }>
      <div className="transition-transform duration-200" style={ { transform: `rotate(${rotationDegree}deg)` } }>
        { currentIcon === 'dark' ?
          <Sun />
        : <Moon /> }
      </div>
    </Button>
  );
}
