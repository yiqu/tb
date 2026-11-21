'use client';

import { useState } from 'react';
import { CircleAlert } from 'lucide-react';

import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/custom/hover-card';

interface Props {
  label: string;
  rules: string[];
}

/** The "!" next to a bill status label. Hover it to see exactly which bills the status counts. */
export default function SubscriptionDetailsBillStatusInfoHoverCard({ label, rules }: Props) {
  // Hover opens it for a mouse. A tap toggles it too, since touch screens have no hover
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <HoverCard open={ isOpen } onOpenChange={ setIsOpen } openDelay={ 100 } closeDelay={ 100 }>
      <HoverCardTrigger asChild>
        <button
          type="button"
          aria-label={ `How "${label}" is counted` }
          aria-expanded={ isOpen }
          onPointerUp={ (event: React.PointerEvent<HTMLButtonElement>) => {
            // a mouse already opened it on hover, so only taps and pens toggle it
            if (event.pointerType !== 'mouse') {
              setIsOpen((open: boolean) => !open);
            }
          } }
          className="inline-flex shrink-0 cursor-help items-center text-muted-foreground hover:text-foreground"
        >
          <CircleAlert className="size-3.5" />
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80" side="left" align="start">
        <ColumnStack className="gap-y-2">
          <Typography variant="h6">{ label }</Typography>
          <ul className="flex list-disc flex-col gap-y-1.5 pl-4">
            { rules.map((rule) => (
              <li key={ rule }>
                <Typography variant="body0">{ rule }</Typography>
              </li>
            )) }
          </ul>
        </ColumnStack>
      </HoverCardContent>
    </HoverCard>
  );
}
