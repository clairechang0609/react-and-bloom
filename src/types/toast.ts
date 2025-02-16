
export type ToastType = 'success' | 'danger';

export interface Toast {
  text: string;
  type: ToastType;
  id?: string;
}
