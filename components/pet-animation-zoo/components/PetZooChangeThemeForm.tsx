'use client';

import { useState } from 'react';
import { DateTime } from 'luxon';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import ColumnStack from '@/shared/components/ColumnStack';

import PetZooLockedLabel from './PetZooLockedLabel';
import PetZooDialogFooter from './PetZooDialogFooter';
import PetZooThemeSwatch from './PetZooThemeSwatch';
import { usePetZooColorMode } from '../hooks/usePetZooColorMode';
import PetZooSelectField, { PetZooSelectOption } from './PetZooSelectField';
import { PET_ZOO_LABELS } from '../constants/pet-zoo-labels.constants';
import { getPetZooNow, isPetZooThemeUnlocked } from '../utils/pet-zoo-unlock.utils';
import { usePetZooActions, usePetZooThemeId, usePetZooUnlocks } from '../store/pet-zoo.store';
import { PET_ZOO_THEMES, PET_ZOO_THEME_IDS, PetZooThemeId } from '../constants/pet-zoo-themes.constants';
import { createPetZooChangeThemeSchema, PetZooChangeThemeFormValues } from '../schemas/pet-zoo-dialogs.schema';

import type { PetZooUnlocks } from '../models/pet-zoo.models';

interface PetZooChangeThemeFormProps {
  onDone: () => void;
}

/** Choose a background from the master list. Locked ones are listed with a lock and cannot be picked. OK switches the zoo to it. */
export default function PetZooChangeThemeForm({ onDone }: PetZooChangeThemeFormProps) {
  const themeId: PetZooThemeId = usePetZooThemeId();
  const colorMode = usePetZooColorMode();
  const { setTheme } = usePetZooActions();
  const unlocks: PetZooUnlocks = usePetZooUnlocks();
  // read once when the dialog opens, like the Spawn dialog
  const [now] = useState<DateTime>(getPetZooNow);
  const isThemeUnlocked = (id: PetZooThemeId): boolean => {
    return isPetZooThemeUnlocked(id, unlocks, now);
  };

  const { control, handleSubmit } = useForm<PetZooChangeThemeFormValues>({
    resolver: zodResolver(createPetZooChangeThemeSchema(isThemeUnlocked)),
    defaultValues: { themeId },
  });

  const options: PetZooSelectOption[] = PET_ZOO_THEME_IDS.map((id: PetZooThemeId) => {
    const isUnlocked: boolean = isThemeUnlocked(id);
    return {
      value: id,
      label: PET_ZOO_THEMES[id].label,
      icon: <PetZooThemeSwatch themeId={ id } colorMode={ colorMode } />,
      trailing: isUnlocked ? null : <PetZooLockedLabel unlocks={ [PET_ZOO_THEMES[id].unlocked, unlocks.themes[id]] } />,
      disabled: !isUnlocked,
    };
  });

  const handleOnSubmit: SubmitHandler<PetZooChangeThemeFormValues> = (values: PetZooChangeThemeFormValues) => {
    setTheme(values.themeId);
    onDone();
  };

  return (
    <form onSubmit={ handleSubmit(handleOnSubmit) } noValidate>
      <ColumnStack className="gap-6">
        <PetZooSelectField
          control={ control }
          name="themeId"
          label={ PET_ZOO_LABELS.themeLabel }
          placeholder={ PET_ZOO_LABELS.themePlaceholder }
          options={ options }
        />
        <PetZooDialogFooter />
      </ColumnStack>
    </form>
  );
}
