import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';
import React, { HTMLAttributes } from 'react';

// Utility function for class name merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type GridSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto' | true;
type GridOffset = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
type GridSpacing = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10;

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  container?: boolean;
  spacing?: GridSpacing;
  xs?: GridSize;
  sm?: GridSize;
  md?: GridSize;
  lg?: GridSize;
  xl?: GridSize;
  xsOffset?: GridOffset;
  smOffset?: GridOffset;
  mdOffset?: GridOffset;
  lgOffset?: GridOffset;
  xlOffset?: GridOffset;
  centered?: boolean; // New prop for explicit centering
}

const spacingMap = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
  10: 'gap-10',
};

const getColumnClass = (value: GridSize, breakpoint = '') => {
  const prefix = breakpoint ? `${breakpoint}:` : '';

  if (value === true) return `${prefix}flex-grow`;
  if (value === 'auto') return `${prefix}w-auto`;

  const fraction = (value as number) / 12;
  if (fraction === 1 / 12) return `${prefix}w-1/12`;
  if (fraction === 2 / 12) return `${prefix}w-1/6`;
  if (fraction === 3 / 12) return `${prefix}w-1/4`;
  if (fraction === 4 / 12) return `${prefix}w-1/3`;
  if (fraction === 5 / 12) return `${prefix}w-5/12`;
  if (fraction === 6 / 12) return `${prefix}w-1/2`;
  if (fraction === 7 / 12) return `${prefix}w-7/12`;
  if (fraction === 8 / 12) return `${prefix}w-2/3`;
  if (fraction === 9 / 12) return `${prefix}w-3/4`;
  if (fraction === 10 / 12) return `${prefix}w-5/6`;
  if (fraction === 11 / 12) return `${prefix}w-11/12`;
  if (fraction === 12 / 12) return `${prefix}w-full`;

  return '';
};

const getOffsetClass = (value: GridOffset, breakpoint = '') => {
  const prefix = breakpoint ? `${breakpoint}:` : '';

  if (value === 0) return '';

  const fraction = value / 12;
  if (fraction === 1 / 12) return `${prefix}ml-1/12`;
  if (fraction === 2 / 12) return `${prefix}ml-1/6`;
  if (fraction === 3 / 12) return `${prefix}ml-1/4`;
  if (fraction === 4 / 12) return `${prefix}ml-1/3`;
  if (fraction === 5 / 12) return `${prefix}ml-5/12`;
  if (fraction === 6 / 12) return `${prefix}ml-1/2`;
  if (fraction === 7 / 12) return `${prefix}ml-7/12`;
  if (fraction === 8 / 12) return `${prefix}ml-2/3`;
  if (fraction === 9 / 12) return `${prefix}ml-3/4`;
  if (fraction === 10 / 12) return `${prefix}ml-5/6`;
  if (fraction === 11 / 12) return `${prefix}ml-11/12`;

  return '';
};

const Grid = ({
  children,
  container = false,
  spacing = 2,
  xs,
  sm,
  md,
  lg,
  xl,
  xsOffset,
  smOffset,
  mdOffset,
  lgOffset,
  xlOffset,
  centered = false,
  className,
  ...props
}: GridProps) => {
  return (
    <div
      className={ cn(
        // Container styles
        container && 'flex w-full flex-wrap',
        container && spacingMap[spacing],
        container && centered && 'justify-center',

        // Column widths
        xs && getColumnClass(xs),
        sm && getColumnClass(sm, 'sm'),
        md && getColumnClass(md, 'md'),
        lg && getColumnClass(lg, 'lg'),
        xl && getColumnClass(xl, 'xl'),

        // Offsets
        xsOffset !== undefined && getOffsetClass(xsOffset),
        smOffset !== undefined && getOffsetClass(smOffset, 'sm'),
        mdOffset !== undefined && getOffsetClass(mdOffset, 'md'),
        lgOffset !== undefined && getOffsetClass(lgOffset, 'lg'),
        xlOffset !== undefined && getOffsetClass(xlOffset, 'xl'),

        // Centering for items
        !container && centered && 'mx-auto',

        // Custom className
        className,
      ) }
      { ...props }
    >
      { children }
    </div>
  );
};

export default Grid;
