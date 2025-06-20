'use client';

import { X } from 'lucide-react';
import { toast, Toast } from 'react-hot-toast';

import { Button } from '../ui/button';

export default function CustomToasterCloseButton({ t }: { t: Toast }) {
  return (
    <Button variant="ghost" size="icon" onClick={ () => toast.remove(t.id) }>
      <X className="size-4" />
    </Button>
  );
}
