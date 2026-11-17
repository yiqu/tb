'use client';

import toast from 'react-hot-toast';
import { use, useRef, useState, useCallback, createContext } from 'react';

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
  // counts the border saves, so a failed save only rolls back when no newer toggle came after it
  const horizontalBordersRequestIdRef = useRef<number>(0);
  const verticalBordersRequestIdRef = useRef<number>(0);
  // the last value the server saved in the cookie
  const horizontalBordersSavedRef = useRef<boolean>(initialValues.showTableHorizontalBorders);
  const verticalBordersSavedRef = useRef<boolean>(initialValues.showTableVerticalBorders);

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
    const requestId: number = ++horizontalBordersRequestIdRef.current;
    setShowTableHorizontalBordersState(value);
    setBodyTableBorderAttribute(TABLE_BORDER_DATA_ATTRIBUTES.horizontal, value);
    setSettingsTableHorizontalBorders(value)
      .then(() => {
        horizontalBordersSavedRef.current = value;
      })
      .catch(() => {
        toast.error('Could not save the table border setting.');
        // a newer toggle owns the setting now, rolling back would undo it
        if (requestId !== horizontalBordersRequestIdRef.current) {
          return;
        }
        // the cookie was not saved: go back to the last saved value, which is what a reload would show
        const savedValue: boolean = horizontalBordersSavedRef.current;
        setShowTableHorizontalBordersState(savedValue);
        setBodyTableBorderAttribute(TABLE_BORDER_DATA_ATTRIBUTES.horizontal, savedValue);
      });
  }, []);

  const setShowTableVerticalBorders = useCallback((value: boolean) => {
    const requestId: number = ++verticalBordersRequestIdRef.current;
    setShowTableVerticalBordersState(value);
    setBodyTableBorderAttribute(TABLE_BORDER_DATA_ATTRIBUTES.vertical, value);
    setSettingsTableVerticalBorders(value)
      .then(() => {
        verticalBordersSavedRef.current = value;
      })
      .catch(() => {
        toast.error('Could not save the table border setting.');
        // a newer toggle owns the setting now, rolling back would undo it
        if (requestId !== verticalBordersRequestIdRef.current) {
          return;
        }
        // the cookie was not saved: go back to the last saved value, which is what a reload would show
        const savedValue: boolean = verticalBordersSavedRef.current;
        setShowTableVerticalBordersState(savedValue);
        setBodyTableBorderAttribute(TABLE_BORDER_DATA_ATTRIBUTES.vertical, savedValue);
      });
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
