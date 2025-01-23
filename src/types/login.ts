import { SetStateAction, Dispatch } from 'react';
import type { ToastType } from './toast';

export interface LoginFormProps {
  setIsLogin: Dispatch<SetStateAction<boolean | null>>;
  showToast: (message: string, type: ToastType) => void;
  setIsFullPageLoading: (value: boolean) => void;
}
