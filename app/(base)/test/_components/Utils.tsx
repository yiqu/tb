import { ReactNode } from 'react';
import { XIcon } from 'lucide-react';
import { CheckIcon } from 'lucide-react';

import RowStack from '@/shared/components/RowStack';
import Typography from '@/components/typography/Typography';

import { Gist, Teammate } from './test.utils';

/**
 * Dropdown list item display component.
 * Typed to Gist rather than generic: the text area supplies the generic, each row renderer is
 * concrete, so the fields below are checked instead of being cast.
 * @param param0
 * @returns
 */
export function ItemOptionDisplay({ item }: { item: Gist }): ReactNode {
  return (
    <RowStack className="items-center gap-x-1">
      <Typography>{ item.alias } </Typography>
      { item.aliasable ?
        <CheckIcon className="size-4 text-green-500" />
      : <XIcon className="size-4 text-red-500" /> }
    </RowStack>
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
      { item.name }{ ' ' }
      <Typography variant="caption1" as="span">
        { item.email } · { item.team }
      </Typography>
    </Typography>
  );
}
