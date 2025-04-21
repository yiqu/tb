'use client';

import { useToast } from '@/hooks/use-toast';
import {
  Toast,
  ToastClose,
  ToastTitle,
  ToastProvider,
  ToastViewport,
  ToastDescription,
} from '@/components/ui-pre-19/toast';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      { toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={ id } { ...props }>
            <div className="grid gap-1">
              { title ? <ToastTitle>{ title }</ToastTitle> : null }
              { description ? <ToastDescription>{ description }</ToastDescription> : null }
            </div>
            { action }
            <ToastClose />
          </Toast>
        );
      }) }
      <ToastViewport />
    </ToastProvider>
  );
}
