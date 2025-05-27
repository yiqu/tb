'use client';

import { useColorScheme } from '@mui/material/styles';

import { useState } from 'react';
import { Sun } from 'lucide-react';
import { Moon } from 'lucide-react';
import { useTheme, UseThemeProps } from 'next-themes';

import { Button } from '@/components/ui/button';
import { useClientOnly } from '@/hooks/useClientOnly';

import { Skeleton } from '../ui/skeleton';

export default function ThemeToggleButton() {
  const isClient = useClientOnly();
  const [rotationDegree, setRotationDegree] = useState(0);
  const { setTheme, theme }: UseThemeProps = useTheme();
  const [currentIcon, setCurrentIcon] = useState<'light' | 'dark'>(theme as 'light' | 'dark');
  const { setMode } = useColorScheme();

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
    <Button variant="outline" size="icon" onClick={ handleOnThemeUpdate }>
      <div className="transition-transform duration-200" style={ { transform: `rotate(${rotationDegree}deg)` } }>
        { currentIcon === 'dark' ?
          <Sun />
        : <Moon /> }
      </div>
    </Button>
  );
}
