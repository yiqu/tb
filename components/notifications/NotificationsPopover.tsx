import { Bell } from 'lucide-react';
import { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/custom/popover';

interface NotificationsPopoverProps {
  /** The sections of the popover, usually one <NotificationsSection> per topic. */
  children: ReactNode;
  /** Optional marker rendered on the corner of the bell, e.g. a dot while something is in progress. */
  indicator?: ReactNode;
  title?: string;
  className?: string;
}

/**
 * A bell button that opens a popover. The popover itself knows nothing about its content: every
 * topic is a child section, so new ones are added by dropping in another child.
 */
export default function NotificationsPopover({ children, indicator, title = 'Notifications', className }: NotificationsPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative" aria-label={ title }>
          <Bell />
          { indicator }
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={ 16 } className={ cn('w-80 p-0', className) }>
        <Typography variant="h6" as="h2" className="border-b px-4 py-3">
          { title }
        </Typography>
        <ColumnStack className="divide-y">{ children }</ColumnStack>
      </PopoverContent>
    </Popover>
  );
}
