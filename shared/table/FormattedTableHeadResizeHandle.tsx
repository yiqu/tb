import { cn } from '@/lib/utils';

import WithTooltip from '../components/WithTooltip';

type FormattedTableHeadResizeHandleProps = {
  handleResizePointerDown: (_e: React.PointerEvent) => void;
  handleResizeDoubleClick?: (_e: React.MouseEvent<HTMLElement>) => void;
  isResizing: boolean;
};

export default function FormattedTableHeadResizeHandle({
  handleResizePointerDown,
  handleResizeDoubleClick,
  isResizing,
}: FormattedTableHeadResizeHandleProps) {
  return (
    <WithTooltip tooltip={ handleResizeDoubleClick ? 'Drag to resize. Double click to auto fit.' : 'Resize column' }>
      <div
        onPointerDown={ handleResizePointerDown }
        onDoubleClick={ handleResizeDoubleClick }
        className={ cn(`
          absolute top-0 right-0 z-10 h-full w-1 cursor-col-resize
          hover:bg-accent
        `, { 'bg-accent': isResizing }) }
      />
    </WithTooltip>
  );
}
