import { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import RowStack from '@/shared/components/RowStack';
import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';

interface NotificationsSectionProps {
  /** The label of the section, e.g. "Upload Status". */
  title: string;
  /** Optional control rendered to the right of the label. */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** One labelled block inside <NotificationsPopover>. */
export default function NotificationsSection({ title, action, children, className }: NotificationsSectionProps) {
  return (
    <ColumnStack className={ cn('gap-y-3 px-4 py-3', className) }>
      <RowStack className="min-h-6 items-center justify-between gap-x-2">
        <Typography variant="label1" as="h3" className="font-medium">
          { title }
        </Typography>
        { action }
      </RowStack>
      { children }
    </ColumnStack>
  );
}
