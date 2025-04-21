'use client';

import toast from 'react-hot-toast';
import { useState, ReactNode } from 'react';
import { Copy, CopyCheck } from 'lucide-react';

import { Button } from '../ui/button';
import Typography from '../typography/Typography';

function CopyToClipBoard({
  text,
  showButtonText,
  children,
  title = 'Copy',
  ...props
}: {
  text?: string;
  showButtonText?: boolean;
  children?: ReactNode;
  title?: string;
} & React.ComponentProps<'button'>) {
  const [isCopied, setIsCopied] = useState(false);

  const handleClick = () => {
    const copy = navigator.clipboard.writeText(text ?? '');
    toast.remove();
    copy.then(() => {
      setIsCopied(true);
      toast.success(`Copied.`, {
        duration: 1000,
      });
      const timer = setTimeout(() => {
        setIsCopied(false);
        clearTimeout(timer);
      }, 2000);
    });
  };

  return (
    <>
      { children }
      <Button size="icon" onClick={ handleClick } title={ title } disabled={ isCopied } variant="ghost" { ...props }>
        <section className="flex flex-row items-center justify-start gap-x-1">
          { isCopied ?
            <CopyCheck className="text-green-900" />
          : <Copy /> }
          { showButtonText ?
            <Typography variant="body1">{ isCopied ? 'Copied' : 'Copy' }</Typography>
          : null }
        </section>
      </Button>
    </>
  );
}

export default CopyToClipBoard;
