import { MutableRefObject } from 'react';

export type ToastType = 'success' | 'danger';

export interface ToastProps {
  toastRef: MutableRefObject<HTMLDivElement | null>;
  toastText: string;
  type?: ToastType;
}
