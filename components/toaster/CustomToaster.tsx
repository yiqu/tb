'use client';

import { useTheme } from 'next-themes';
import { Toaster, ToastBar } from 'react-hot-toast';

import RowStack from '@/shared/components/RowStack';

import CustomToasterCloseButton from './CustomToasterCloseButton';

function CustomToaster() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <Toaster
      position="top-center"
      containerClassName="app-toast-container"
      toastOptions={ {
        className: 'app-toast',
        duration: 8_000,
        success: {
          duration: 10_000,
        },
        error: {
          duration: 11_000,
        },
        style: {
          maxWidth: '40rem',
          background: isDark ? '#1c1c1e' : '#fff',
          color: isDark ? '#f5f5f7' : '#1c1c1e',
          borderColor: isDark ? '#38383a' : '#e5e5e5',
        },
      } }
    >
      { (t) => (
        <ToastBar toast={ t }>
          { ({ icon, message }) => (
            <RowStack className="items-center justify-between">
              <RowStack className="items-center justify-start">
                { icon }
                <div>{ message }</div>
              </RowStack>
              { t.type !== 'loading' && <CustomToasterCloseButton t={ t } /> }
            </RowStack>
          ) }
        </ToastBar>
      ) }
    </Toaster>
  );
}

export default CustomToaster;

