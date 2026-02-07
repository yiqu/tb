'use client';

import z from 'zod';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

import { Form } from '@/components/ui/form';
import HFSelect, { HFSelectOption } from '@/components/hook-form/HFSelect';
import { setSettingsApplicationVibe } from '@/server/settings/vibe-select';
import VibeSelectionItemDisplay from '@/shared/components/VibeSelectionItemDisplay';
import { generalSettingsVibeSchema } from '@/validators/settings/general/general.schema';
import { AppVibe, APP_VIBE_OPTIONS_MAP, APP_VIBE_OPTIONS_LIST } from '@/models/settings/general-settings.models';

interface AccountGeneralVibeSelectionContentProps {
  vibe: AppVibe;
}

export default function AccountGeneralVibeSelectionContent({ vibe }: AccountGeneralVibeSelectionContentProps) {
  const methods = useForm<z.infer<typeof generalSettingsVibeSchema>>({
    defaultValues: {
      vibe: vibe,
    },
  });

  const onSubmit = async (data: z.infer<typeof generalSettingsVibeSchema>) => {
    toast.promise(setSettingsApplicationVibe(data.vibe), {
      loading: 'Updating vibe...',
      success: () => `Vibe updated to ${APP_VIBE_OPTIONS_MAP[data.vibe]}.`,
      error: (error: Error) => `Failed to update vibe. ${error.message}`,
    });
  };

  return (
    <Form { ...methods }>
      <form className="w-full" onSubmit={ methods.handleSubmit(onSubmit) } id="account-general-vibe-selection-form">
        <HFSelect
          name="vibe"
          options={ APP_VIBE_OPTIONS_LIST }
          control={ methods.control }
          label="Vibe"
          placeholder="Select a vibe"
          formItemClassName="w-[50%]"
          onChanged={ () => methods.handleSubmit(onSubmit)() }
          renderOption={ (option: HFSelectOption) => <VibeSelectionItemDisplay key={ option.value } option={ option } /> }
        />
      </form>
    </Form>
  );
}
