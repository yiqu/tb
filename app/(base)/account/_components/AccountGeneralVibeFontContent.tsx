'use client';

import z from 'zod';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

import { Form } from '@/components/ui/form';
import HFSelect from '@/components/hook-form/HFSelect';
import { setSettingsApplicationFont } from '@/server/settings/vibe-select';
import { generalSettingsFontSchema } from '@/validators/settings/general/general.schema';
import { AppFont, APP_FONT_OPTIONS_MAP, APP_FONT_OPTIONS_LIST } from '@/models/settings/general-settings.models';

interface AccountGeneralVibeFontContentProps {
  font: AppFont;
}

export default function AccountGeneralVibeFontContent({ font }: AccountGeneralVibeFontContentProps) {
  const methods = useForm<z.infer<typeof generalSettingsFontSchema>>({
    defaultValues: {
      font: font,
    },
  });

  const onSubmit = async (data: z.infer<typeof generalSettingsFontSchema>) => {
    toast.promise(setSettingsApplicationFont(data.font), {
      loading: 'Updating font...',
      success: () => `Font updated to ${APP_FONT_OPTIONS_MAP[data.font]}.`,
      error: (error: Error) => `Failed to update font. ${error.message}`,
    });
  };

  return (
    <Form { ...methods }>
      <form className="w-full" onSubmit={ methods.handleSubmit(onSubmit) } id="account-general-vibe-font-selection-form">
        <HFSelect
          name="font"
          options={ APP_FONT_OPTIONS_LIST }
          control={ methods.control }
          label="Font override"
          placeholder="Select a font to override the vibe's default"
          formItemClassName="w-[50%]"
          onChanged={ () => methods.handleSubmit(onSubmit)() }
        />
      </form>
    </Form>
  );
}
