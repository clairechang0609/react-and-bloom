import { SetStateAction, Dispatch, MutableRefObject } from 'react';
import type { Toast } from 'bootstrap';

export interface LoginFormProps {
  toast: MutableRefObject<Toast | null>;
  setIsLogin: Dispatch<SetStateAction<boolean | null>>;
  setToastText: Dispatch<SetStateAction<string>>;
}
