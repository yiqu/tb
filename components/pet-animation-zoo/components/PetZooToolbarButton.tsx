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

/**
 * A small icon button of the zoo's hover toolbar, with its name in a tooltip.
 * Disabled is `aria-disabled`, not `disabled`: the button stays reachable by mouse and keyboard, so its tooltip
 * can still say why it is off.
 */
export default function PetZooToolbarButton({ label, icon, onClick, disabled = false, disabledLabel }: PetZooToolbarButtonProps) {
  const handleOnClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="
            bg-background/75 text-foreground shadow-xs backdrop-blur-sm
            hover:bg-background
            aria-disabled:cursor-not-allowed aria-disabled:opacity-50
            aria-disabled:hover:bg-background/75
          "
          onClick={ handleOnClick }
          aria-disabled={ disabled }
          aria-label={ label }
        >
          { icon }
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">{ disabled && disabledLabel ? disabledLabel : label }</TooltipContent>
    </Tooltip>
  );
}
