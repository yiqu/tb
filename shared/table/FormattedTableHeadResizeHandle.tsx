import { cn } from '@/lib/utils';

import WithTooltip from '../components/WithTooltip';

type FormattedTableHeadResizeHandleProps = {
  handleResizePointerDown: (_e: React.PointerEvent) => void;
  isResizing: boolean;
  isLastColumn?: boolean;
};

export default function FormattedTableHeadResizeHandle({
  handleResizePointerDown,
  isResizing,
  isLastColumn,
}: FormattedTableHeadResizeHandleProps) {
  if (isLastColumn) {
    return null;
  }

  return (
    <WithTooltip tooltip="Resize column">
      <div
        onPointerDown={ handleResizePointerDown }
        className={ cn(`
          absolute top-0 right-0 z-10 h-full w-1 cursor-col-resize
          hover:bg-accent
        `, { 'bg-accent': isResizing }) }
      />
    </WithTooltip>
  );
}
