import { ReactNode } from "react";

export interface AlertModalProps {
  children: ReactNode;
  nextFn?: () => void;
}
