/* eslint-disable readable-tailwind/multiline */
import omit from 'lodash/omit';
import { ReactNode } from 'react';
import { Info, Flame, BadgeInfo, Lightbulb, CircleCheck, LucideProps, TriangleAlert } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Alert as ShadcnAlert,
  AlertTitle as ShadcnAlertTitle,
  AlertDescription as ShadcnAlertDescription,
} from '@/components/ui/alert';

interface AlertProps {
  title?: ReactNode;
  description: ReactNode;
  variant: 'note' | 'info' | 'success' | 'warning' | 'danger' | 'tip';
}

export function Alert({ title, description, variant = 'note' }: AlertProps) {
  return (
    <ShadcnAlert
      className={ cn('[&>svg]:size-4.5', {
        'bg-green-200/20 dark:bg-green-800/30': variant === 'success' || variant === 'tip',
        'bg-blue-200/20 dark:bg-blue-800/30': variant === 'info',
        'bg-yellow-200/20 dark:bg-yellow-800/30': variant === 'warning',
        'bg-red-200/20 dark:bg-red-800/30': variant === 'danger',
      }) }
    >
      <AlertIcon variant={ variant } />
      <ShadcnAlertTitle> { title ? title : variant.toUpperCase() }</ShadcnAlertTitle>
      <ShadcnAlertDescription className=""> { description }</ShadcnAlertDescription>
    </ShadcnAlert>
  );
}

function AlertIcon({ variant, iconProps }: { variant: AlertProps['variant']; iconProps?: LucideProps }) {
  switch (variant) {
    case 'note':
      return <BadgeInfo className={ cn('', iconProps?.className) } { ...omit(iconProps, 'className') } />;
    case 'info': {
      return (
        <Info
          className={ cn(`stroke-blue-800 dark:stroke-blue-400`, iconProps?.className) }
          { ...omit(iconProps, 'className') }
        />
      );
    }
    case 'success': {
      return (
        <CircleCheck
          className={ cn(`stroke-green-800 dark:stroke-green-400`, iconProps?.className) }
          { ...omit(iconProps, 'className') }
          height={ 32 }
          width={ 32 }
        />
      );
    }
    case 'warning': {
      return (
        <TriangleAlert
          className={ cn(`stroke-yellow-800 dark:stroke-yellow-400`, iconProps?.className) }
          { ...omit(iconProps, 'className') }
        />
      );
    }
    case 'danger': {
      return (
        <Flame
          className={ cn(`stroke-red-800 dark:stroke-red-400`, iconProps?.className) }
          { ...omit(iconProps, 'className') }
        />
      );
    }
    case 'tip': {
      return (
        <Lightbulb
          className={ cn(`stroke-green-800 dark:stroke-green-400`, iconProps?.className) }
          { ...omit(iconProps, 'className') }
        />
      );
    }
  }
}
