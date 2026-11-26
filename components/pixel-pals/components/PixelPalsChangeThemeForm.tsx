'use client';

import { useEffect } from 'react';
import { useForm, useWatch, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import ColumnStack from '@/shared/components/ColumnStack';

import PixelPalsLockedLabel from './PixelPalsLockedLabel';
import PixelPalsDialogFooter from './PixelPalsDialogFooter';
import PixelPalsThemeSwatch from './PixelPalsThemeSwatch';
import PixelPalsSliderField from './PixelPalsSliderField';
import { usePixelPalsColorMode } from '../hooks/usePixelPalsColorMode';
import PixelPalsSelectField, { PixelPalsSelectOption } from './PixelPalsSelectField';
import { PIXEL_PALS_LABELS } from '../constants/pixel-pals-labels.constants';
import { PIXEL_PALS_PARTICLE_EFFECTS, PIXEL_PALS_PARTICLE_LEVEL_MAX, PIXEL_PALS_PARTICLE_LEVEL_MIN, PIXEL_PALS_PARTICLE_LEVEL_STEP } from '../constants/pixel-pals-particles.constants';
import {
  useGetParticleLevels,
  usePixelPetStoreActions,
  useGetUnlockedBackgrounds,
  useGetUserPixelPetBackground,
} from '../store/pixel-pets.store';
import { PIXEL_PALS_THEMES, PIXEL_PALS_THEME_IDS, PixelPalsThemeId } from '../constants/pixel-pals-themes.constants';
import { createPixelPalsChangeThemeSchema, PixelPalsChangeThemeFormValues } from '../schemas/pixel-pals-dialogs.schema';

import type { PixelPetParticleLevels, PixelPalsThemeParticles, PixelPetUnlockedBackgrounds } from '../models/pixel-pals.models';

interface PixelPalsChangeThemeFormProps {
  onDone: () => void;
}

function formatParticleLevel(level: number): string {
  if (level <= PIXEL_PALS_PARTICLE_LEVEL_MIN) {
    return PIXEL_PALS_LABELS.particleLevelOff;
  }
  return PIXEL_PALS_LABELS.particleLevelValue.replace('{level}', String(level));
}

/**
 * Choose a background from the master list. Locked ones are listed with a lock and cannot be picked. A background with
 * weather also gets a slider for how much of it there is (the count, never the size). OK switches Pixel Pals to it,
 * and saves the slider's level for that background when it was moved.
 */
export default function PixelPalsChangeThemeForm({ onDone }: PixelPalsChangeThemeFormProps) {
  const themeId: PixelPalsThemeId = useGetUserPixelPetBackground();
  const colorMode = usePixelPalsColorMode();
  const { setUserPixelPetBackground, setUserPixelPetParticleLevel } = usePixelPetStoreActions();
  const particleLevels: PixelPetParticleLevels = useGetParticleLevels();
  const unlockedBackgrounds: PixelPetUnlockedBackgrounds = useGetUnlockedBackgrounds();
  // the theme in use can always be kept, even after it was locked: OK on it just closes the dialog
  const canPickTheme = (id: PixelPalsThemeId): boolean => {
    return id === themeId || unlockedBackgrounds[id];
  };

  const { control, handleSubmit, setValue } = useForm<PixelPalsChangeThemeFormValues>({
    resolver: zodResolver(createPixelPalsChangeThemeSchema(canPickTheme)),
    defaultValues: { themeId, particleLevel: particleLevels[themeId] },
  });
  const selectedThemeId: PixelPalsThemeId = useWatch({ control, name: 'themeId' });
  const selectedParticles: PixelPalsThemeParticles | undefined = PIXEL_PALS_THEMES[selectedThemeId].particles;

  // the slider starts at the level the newly picked background has now
  useEffect(() => {
    setValue('particleLevel', particleLevels[selectedThemeId]);
  }, [selectedThemeId, particleLevels, setValue]);

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
    // saved only when moved, so a background left alone keeps following the master list's default
    if (values.particleLevel !== particleLevels[values.themeId]) {
      setUserPixelPetParticleLevel(values.themeId, values.particleLevel);
    }
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
        { selectedParticles ?
          <PixelPalsSliderField
            control={ control }
            name="particleLevel"
            label={ PIXEL_PALS_PARTICLE_EFFECTS[selectedParticles.effect].label }
            min={ PIXEL_PALS_PARTICLE_LEVEL_MIN }
            max={ PIXEL_PALS_PARTICLE_LEVEL_MAX }
            step={ PIXEL_PALS_PARTICLE_LEVEL_STEP }
            formatValue={ formatParticleLevel }
          />
        : null }
        <PixelPalsDialogFooter />
      </ColumnStack>
    </form>
  );
}
