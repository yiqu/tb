'use client';

import { Toaster, ToastBar } from 'react-hot-toast';

import CustomToasterCloseButton from './CustomToasterCloseButton';

function CustomToaster() {
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
          maxWidth: '28rem',
        },
      } }
    >
      { (t) => (
        <ToastBar toast={ t }>
          { ({ icon, message }) => (
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center justify-start">
                { icon }
                <div>{ message }</div>
              </div>
              { t.type !== 'loading' && <CustomToasterCloseButton t={ t } /> }
            </div>
          ) }
        </ToastBar>
      ) }
    </Toaster>
  );
}

export default CustomToaster;
