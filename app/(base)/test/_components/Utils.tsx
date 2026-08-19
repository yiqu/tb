import { ReactNode } from 'react';
import { XIcon } from 'lucide-react';
import { CheckIcon } from 'lucide-react';

import Typography from '@/components/typography/Typography';

import { Gist } from './test.utils';

/**
 * Dropdown list item display component.
 * @param param0 
 * @returns 
 */
export function ItemOptionDisplay<T>({ item }: { item: T }): ReactNode {
  return (
    <Typography>
      { (item as Gist).alias }{ ' ' }
      { (item as Gist).aliasable ?
        <CheckIcon />
      : <XIcon /> }
    </Typography>
  );
}
