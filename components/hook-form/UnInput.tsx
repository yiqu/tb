import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

import { Button } from '../ui/button';

type UncontrolledInputProps = Omit<React.ComponentProps<'input'>, 'value' | 'onChange'> & {
  onClear?: () => void;
  onChange?: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
};

export default function UncontrolledInput({ className, onClear, onChange, value = '', ...props }: UncontrolledInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
  };
  return (
    <div className="relative">
      <Input className={ cn('pr-8', className) } value={ value } onChange={ handleChange } { ...props } />
      { value ?
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="Clear input"
          onClick={ () => onClear?.() }
          className={ `
            absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground
            hover:text-foreground
          ` }
        >
          <X className="size-4" />
        </Button>
      : null }
    </div>
  );
}
