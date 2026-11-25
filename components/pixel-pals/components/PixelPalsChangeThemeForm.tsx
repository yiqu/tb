'use client';

import { useState } from 'react';
import { DateTime } from 'luxon';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import ColumnStack from '@/shared/components/ColumnStack';

import PixelPalsLockedLabel from './PixelPalsLockedLabel';
import PixelPalsDialogFooter from './PixelPalsDialogFooter';
import PixelPalsThemeSwatch from './PixelPalsThemeSwatch';
import { usePixelPalsColorMode } from '../hooks/usePixelPalsColorMode';
import PixelPalsSelectField, { PixelPalsSelectOption } from './PixelPalsSelectField';
import { PIXEL_PALS_LABELS } from '../constants/pixel-pals-labels.constants';
import { getPixelPalsNow, isPixelPalsThemeUnlocked } from '../utils/pixel-pals-unlock.utils';
import { usePixelPalsActions, usePixelPalsThemeId, usePixelPalsUnlocks } from '../store/pixel-pals.store';
import { PIXEL_PALS_THEMES, PIXEL_PALS_THEME_IDS, PixelPalsThemeId } from '../constants/pixel-pals-themes.constants';
import { createPixelPalsChangeThemeSchema, PixelPalsChangeThemeFormValues } from '../schemas/pixel-pals-dialogs.schema';

import type { PixelPalsUnlocks } from '../models/pixel-pals.models';

interface PixelPalsChangeThemeFormProps {
  onDone: () => void;
}

/** Choose a background from the master list. Locked ones are listed with a lock and cannot be picked. OK switches Pixel Pals to it. */
export default function PixelPalsChangeThemeForm({ onDone }: PixelPalsChangeThemeFormProps) {
  const themeId: PixelPalsThemeId = usePixelPalsThemeId();
  const colorMode = usePixelPalsColorMode();
  const { setTheme } = usePixelPalsActions();
  const unlocks: PixelPalsUnlocks = usePixelPalsUnlocks();
  // read once when the dialog opens, like the Spawn dialog
  const [now] = useState<DateTime>(getPixelPalsNow);
  const isThemeUnlocked = (id: PixelPalsThemeId): boolean => {
    return isPixelPalsThemeUnlocked(id, unlocks, now);
  };

  const { control, handleSubmit } = useForm<PixelPalsChangeThemeFormValues>({
    resolver: zodResolver(createPixelPalsChangeThemeSchema(isThemeUnlocked)),
    defaultValues: { themeId },
  });

  const options: PixelPalsSelectOption[] = PIXEL_PALS_THEME_IDS.map((id: PixelPalsThemeId) => {
    const isUnlocked: boolean = isThemeUnlocked(id);
    return {
      value: id,
      label: PIXEL_PALS_THEMES[id].label,
      icon: <PixelPalsThemeSwatch themeId={ id } colorMode={ colorMode } />,
      trailing: isUnlocked ? null : <PixelPalsLockedLabel unlocks={ [PIXEL_PALS_THEMES[id].unlocked, unlocks.themes[id]] } />,
      disabled: !isUnlocked,
    };
  });

  const handleOnSubmit: SubmitHandler<PixelPalsChangeThemeFormValues> = (values: PixelPalsChangeThemeFormValues) => {
    setTheme(values.themeId);
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
