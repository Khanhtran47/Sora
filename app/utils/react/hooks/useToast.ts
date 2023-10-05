import { useEffect } from 'react';
import { toast } from 'sonner';

import type { ToastMessage } from '~/utils/server/toast-session.server';

export const useToast = (message?: ToastMessage) => {
  useEffect(() => {
    if (message) {
      switch (message.type) {
        case 'default':
          toast(message.title, {
            description: message.description,
          });
          break;
        case 'success':
          toast.success(message.title, {
            description: message.description,
          });
          break;
        case 'error':
          toast.error(message.title, {
            description: message.description,
          });
          break;
        default:
          throw new Error(`${message.type} is not handled`);
      }
    }
  }, [message]);
};
