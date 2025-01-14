import { ReactNode, RefObject } from 'react';
import { UseFormRegister, FieldValues, FieldErrors } from 'react-hook-form';

interface FormItemBase {
  id: string;
  label: string;
  register: UseFormRegister<FieldValues>;
  rules?: Record<string, unknown>;
  errors: FieldErrors<FieldValues>;
}

export interface InputProps extends FormItemBase {
  type?: string;
  placeholder?: string;
}

export interface TextAreaProps extends FormItemBase {
  rows?: number;
  placeholder?: string;
}

export interface FieldProps {
  id: string;
  label: string;
  children: ReactNode;
  isRequired?: boolean;
  errors: FieldErrors<FieldValues>;
}
