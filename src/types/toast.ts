
export type ToastType = 'success' | 'danger';

export interface ToastRef {
  show: (text: string, type: ToastType) => void;
}
