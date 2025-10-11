import { useQuery } from '@tanstack/react-query';
import { useFormContext } from 'react-hook-form';

import HFSelect from '@/components/hook-form/HFSelect';
import Typography from '@/components/typography/Typography';
import { getCitiesByStateNameQueryOptions } from '@/server/playground/query/playground.query';

export default function CitySelect({ state }: { state: string }) {
  const { control } = useFormContext();
  const { data, isLoading } = useQuery({
    ...getCitiesByStateNameQueryOptions(state),
    enabled: !!state,
    staleTime: 15_000,
    gcTime: 1_000,
  });

  return (
    <div>
      <Typography>Selected: { state }</Typography>
      <HFSelect
        name="city"
        control={ control }
        options={ data?.map((city) => ({ label: city, value: city })) || [] }
        placeholder={ isLoading ? 'Loading...' : 'Select a city' }
        disabled={ isLoading }
        isLoading={ isLoading }
      />
    </div>
  );
}
