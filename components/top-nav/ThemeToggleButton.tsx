'use client';

import { useColorScheme } from '@mui/material/styles';

import { Sun } from 'lucide-react';
import { Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme, UseThemeProps } from 'next-themes';

import { Button } from '@/components/ui/button';

import { Skeleton } from '../ui/skeleton';

export default function ThemeToggleButton() {
  const [mounted, setMounted] = useState(false);
  const [rotationDegree, setRotationDegree] = useState(0);
  const { setTheme, theme }: UseThemeProps = useTheme();
  const [currentIcon, setCurrentIcon] = useState<'light' | 'dark'>(theme as 'light' | 'dark');
  const { setMode } = useColorScheme();

  // useEffect only runs on the client, so now we can safely show the UI 
  useEffect(() => {
    setMounted(true);
  }, []);

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
  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Skeleton className="h-4 w-4 rounded-full" />
      </Button>
    );
  }

  return (
    <Button variant="outline" size="icon" onClick={ handleOnThemeUpdate }>
      <div className="transition-transform duration-200" style={ { transform: `rotate(${rotationDegree}deg)` } }>
        { currentIcon === 'dark' ?
          <Sun />
        : <Moon /> }
      </div>
    </Button>
  );
}
