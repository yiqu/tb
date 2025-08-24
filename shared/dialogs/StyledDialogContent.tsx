import { ReactNode } from 'react';

import { DialogTitle, DialogHeader, DialogContent, DialogDescription } from '@/components/ui/dialog';

export default function StyledDialogContent({
  headerTitle,
  headerDescription,
  children,
}: {
  headerTitle?: ReactNode;
  headerDescription?: ReactNode;
  children: ReactNode;
}) {
  return (
    <DialogContent
      className={ `
        max-h-[90vh] gap-y-0 overflow-x-auto px-0 pt-0 pb-0
        two:w-[800px] two:max-w-[1000px]!
        main:w-[1000px] main:max-w-[1200px]!
        sm:max-w-[600px]
      ` }
    >
      <DialogHeader className="kq-light-shadow sticky top-0 z-10 mb-4 border-b bg-background px-4 py-4">
        <DialogTitle>{ headerTitle }</DialogTitle>
        <DialogDescription asChild>{ headerDescription }</DialogDescription>
      </DialogHeader>
      { children }
    </DialogContent>
  );
}
