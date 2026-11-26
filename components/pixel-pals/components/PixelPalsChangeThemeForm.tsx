'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import ColumnStack from '@/shared/components/ColumnStack';

import PixelPalsLockedLabel from './PixelPalsLockedLabel';
import PixelPalsDialogFooter from './PixelPalsDialogFooter';
import PixelPalsThemeSwatch from './PixelPalsThemeSwatch';
import { usePixelPalsColorMode } from '../hooks/usePixelPalsColorMode';
import PixelPalsSelectField, { PixelPalsSelectOption } from './PixelPalsSelectField';
import { PIXEL_PALS_LABELS } from '../constants/pixel-pals-labels.constants';
import { usePixelPetStoreActions, useGetUnlockedBackgrounds, useGetUserPixelPetBackground } from '../store/pixel-pets.store';
import { PIXEL_PALS_THEMES, PIXEL_PALS_THEME_IDS, PixelPalsThemeId } from '../constants/pixel-pals-themes.constants';
import { createPixelPalsChangeThemeSchema, PixelPalsChangeThemeFormValues } from '../schemas/pixel-pals-dialogs.schema';

import type { PixelPetUnlockedBackgrounds } from '../models/pixel-pals.models';

interface PixelPalsChangeThemeFormProps {
  onDone: () => void;
}

/** Choose a background from the master list. Locked ones are listed with a lock and cannot be picked. OK switches Pixel Pals to it. */
export default function PixelPalsChangeThemeForm({ onDone }: PixelPalsChangeThemeFormProps) {
  const themeId: PixelPalsThemeId = useGetUserPixelPetBackground();
  const colorMode = usePixelPalsColorMode();
  const { setUserPixelPetBackground } = usePixelPetStoreActions();
  const unlockedBackgrounds: PixelPetUnlockedBackgrounds = useGetUnlockedBackgrounds();
  // the theme in use can always be kept, even after it was locked: OK on it just closes the dialog
  const canPickTheme = (id: PixelPalsThemeId): boolean => {
    return id === themeId || unlockedBackgrounds[id];
  };

  const { control, handleSubmit } = useForm<PixelPalsChangeThemeFormValues>({
    resolver: zodResolver(createPixelPalsChangeThemeSchema(canPickTheme)),
    defaultValues: { themeId },
  });

  const options: PixelPalsSelectOption[] = PIXEL_PALS_THEME_IDS.map((id: PixelPalsThemeId) => {
    const isUnlocked: boolean = unlockedBackgrounds[id];
    return {
      value: id,
      label: PIXEL_PALS_THEMES[id].label,
      icon: <PixelPalsThemeSwatch themeId={ id } colorMode={ colorMode } />,
      trailing: isUnlocked ? null : <PixelPalsLockedLabel />,
      disabled: !canPickTheme(id),
    };
  });

  const handleOnSubmit: SubmitHandler<PixelPalsChangeThemeFormValues> = (values: PixelPalsChangeThemeFormValues) => {
    setUserPixelPetBackground(values.themeId);
    onDone();
  };

  return (
    <form onSubmit={ handleSubmit(handleOnSubmit) } noValidate>
      <ColumnStack className="gap-6">
        <PixelPalsSelectField
          control={ control }
          name="themeId"
          label={ PIXEL_PALS_LABELS.themeLabel }
          placeholder={ PIXEL_PALS_LABELS.themePlaceholder }
          options={ options }
        />
        <PixelPalsDialogFooter />
      </ColumnStack>
    </form>
  );
}
