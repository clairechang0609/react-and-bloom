import { MutableRefObject } from 'react';

export interface ToastProps {
  toastRef: MutableRefObject<HTMLDivElement | null>;
  toastText: string;
}
