import { ReactNode, RefObject } from "react";

export interface AlertModalProps {
  alertModalRef: RefObject<HTMLDivElement>;
  children: ReactNode;
  nextFn?: () => void;
}
