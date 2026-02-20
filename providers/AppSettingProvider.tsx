'use client';

import { use, useState, useCallback, createContext } from 'react';

import { setSettingsApplicationAdminMode, setSettingsApplicationCompactMode } from '@/server/settings/app-settings';

export type AppSettingContextType = {
  isCompactMode: boolean;
  setCompactMode: (_value: boolean) => void;
  toggleCompactMode: () => void;

  isAdminMode: boolean;
  setAdminMode: (_value: boolean) => void;
  toggleAdminMode: () => void;
};

type AppSettingProviderProps = {
  children: React.ReactNode;
  initialValues: {
    isCompactMode: boolean;
    isAdminMode: boolean;
  };
};

const AppSettingContext = createContext<AppSettingContextType | undefined>(undefined);

export function AppSettingProvider({ children, initialValues }: AppSettingProviderProps) {
  const [isCompactMode, setIsCompactMode] = useState(initialValues.isCompactMode);
  const [isAdminMode, setIsAdminMode] = useState(initialValues.isAdminMode);

  const setCompactMode = useCallback((value: boolean) => {
    setIsCompactMode(value);
    setSettingsApplicationCompactMode(value);
  }, []);

  const toggleCompactMode = useCallback(() => {
    setCompactMode(!isCompactMode);
  }, [isCompactMode, setCompactMode]);

  const setAdminMode = useCallback((value: boolean) => {
    setIsAdminMode(value);
    setSettingsApplicationAdminMode(value);
  }, []);

  const toggleAdminMode = useCallback(() => {
    setAdminMode(!isAdminMode);
  }, [isAdminMode, setAdminMode]);

  return (
    <AppSettingContext value={ { isCompactMode, setCompactMode, toggleCompactMode, isAdminMode, setAdminMode, toggleAdminMode } }>
      { children }
    </AppSettingContext>
  );
}

export function useAppSetting(): AppSettingContextType {
  const context = use(AppSettingContext);
  if (!context) throw new Error('useAppSetting must be used within AppSettingProvider');
  return context;
}
