import { ReactNode } from 'react';
import { XIcon } from 'lucide-react';
import { CheckIcon } from 'lucide-react';

import Typography from '@/components/typography/Typography';

import { Gist, Teammate } from './test.utils';

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

/**
 * Dropdown list item display component for the bonus Teammate type.
 * @param param0
 * @returns
 */
export function TeammateOptionDisplay({ item }: { item: Teammate }): ReactNode {
  return (
    <Typography>
      { item.name } <Typography variant="caption1" as="span">{ item.email } · { item.team }</Typography>
    </Typography>
  );
}
