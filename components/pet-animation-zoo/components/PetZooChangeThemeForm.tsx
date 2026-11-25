'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import ColumnStack from '@/shared/components/ColumnStack';

import PetZooDialogFooter from './PetZooDialogFooter';
import PetZooThemeSwatch from './PetZooThemeSwatch';
import { usePetZooColorMode } from '../hooks/usePetZooColorMode';
import PetZooSelectField, { PetZooSelectOption } from './PetZooSelectField';
import { PET_ZOO_LABELS } from '../constants/pet-zoo-labels.constants';
import { usePetZooActions, usePetZooThemeId } from '../store/pet-zoo.store';
import { PET_ZOO_THEMES, PET_ZOO_THEME_IDS, PetZooThemeId } from '../constants/pet-zoo-themes.constants';
import { petZooChangeThemeSchema, PetZooChangeThemeFormValues } from '../schemas/pet-zoo-dialogs.schema';

interface PetZooChangeThemeFormProps {
  onDone: () => void;
}

/** Choose a background. OK switches the zoo to it. */
export default function PetZooChangeThemeForm({ onDone }: PetZooChangeThemeFormProps) {
  const themeId: PetZooThemeId = usePetZooThemeId();
  const colorMode = usePetZooColorMode();
  const { setTheme } = usePetZooActions();

  const { control, handleSubmit } = useForm<PetZooChangeThemeFormValues>({
    resolver: zodResolver(petZooChangeThemeSchema),
    defaultValues: { themeId },
  });

  const options: PetZooSelectOption[] = PET_ZOO_THEME_IDS.map((id: PetZooThemeId) => {
    return {
      value: id,
      label: PET_ZOO_THEMES[id].label,
      icon: <PetZooThemeSwatch themeId={ id } colorMode={ colorMode } />,
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
