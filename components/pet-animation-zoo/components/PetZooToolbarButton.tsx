'use client';

import { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface PetZooToolbarButtonProps {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  /** Shown in the tooltip instead of the label while disabled, e.g. why it is disabled. */
  disabledLabel?: string;
}

/** A small icon button of the zoo's hover toolbar, with its name in a tooltip. */
export default function PetZooToolbarButton({ label, icon, onClick, disabled = false, disabledLabel }: PetZooToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        { /* a disabled button gets no pointer events, the span keeps the tooltip working */ }
        <span className="inline-flex">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="
              bg-background/75 text-foreground shadow-xs backdrop-blur-sm
              hover:bg-background
            "
            onClick={ onClick }
            disabled={ disabled }
            aria-label={ label }
          >
            { icon }
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent side="top">{ disabled && disabledLabel ? disabledLabel : label }</TooltipContent>
    </Tooltip>
  );
}
