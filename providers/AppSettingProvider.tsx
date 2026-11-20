'use client';

import { use, useState, useCallback, createContext } from 'react';

import { TABLE_BORDER_DATA_ATTRIBUTES } from '@/constants/constants';
import {
  setSettingsApplicationAdminMode,
  setSettingsTableVerticalBorders,
  setSettingsApplicationCompactMode,
  setSettingsTableHorizontalBorders,
} from '@/server/settings/app-settings';

export type AppSettingContextType = {
  isCompactMode: boolean;
  setCompactMode: (_value: boolean) => void;
  toggleCompactMode: () => void;

  isAdminMode: boolean;
  setAdminMode: (_value: boolean) => void;
  toggleAdminMode: () => void;

  showTableHorizontalBorders: boolean;
  setShowTableHorizontalBorders: (_value: boolean) => void;

  showTableVerticalBorders: boolean;
  setShowTableVerticalBorders: (_value: boolean) => void;
};

type AppSettingProviderProps = {
  children: React.ReactNode;
  initialValues: {
    isCompactMode: boolean;
    isAdminMode: boolean;
    showTableHorizontalBorders: boolean;
    showTableVerticalBorders: boolean;
  };
};

/** Updates the <body> attribute right away so tables restyle without waiting for the server re-render. */
function setBodyTableBorderAttribute(attribute: string, value: boolean) {
  document.body.setAttribute(attribute, String(value));
}

const AppSettingContext = createContext<AppSettingContextType | undefined>(undefined);

export function AppSettingProvider({ children, initialValues }: AppSettingProviderProps) {
  const [isCompactMode, setIsCompactMode] = useState(initialValues.isCompactMode);
  const [isAdminMode, setIsAdminMode] = useState(initialValues.isAdminMode);
  const [showTableHorizontalBorders, setShowTableHorizontalBordersState] = useState(initialValues.showTableHorizontalBorders);
  const [showTableVerticalBorders, setShowTableVerticalBordersState] = useState(initialValues.showTableVerticalBorders);

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

  const setShowTableHorizontalBorders = useCallback((value: boolean) => {
    setShowTableHorizontalBordersState(value);
    setBodyTableBorderAttribute(TABLE_BORDER_DATA_ATTRIBUTES.horizontal, value);
    setSettingsTableHorizontalBorders(value);
  }, []);

  const setShowTableVerticalBorders = useCallback((value: boolean) => {
    setShowTableVerticalBordersState(value);
    setBodyTableBorderAttribute(TABLE_BORDER_DATA_ATTRIBUTES.vertical, value);
    setSettingsTableVerticalBorders(value);
  }, []);

  return (
    <AppSettingContext
      value={ {
        isCompactMode,
        setCompactMode,
        toggleCompactMode,
        isAdminMode,
        setAdminMode,
        toggleAdminMode,
        showTableHorizontalBorders,
        setShowTableHorizontalBorders,
        showTableVerticalBorders,
        setShowTableVerticalBorders,
      } }
    >
      { children }
    </AppSettingContext>
  );
}

export function useAppSetting(): AppSettingContextType {
  const context = use(AppSettingContext);
  if (!context) throw new Error('useAppSetting must be used within AppSettingProvider');
  return context;
}
