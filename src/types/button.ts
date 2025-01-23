import { MouseEventHandler, ReactNode } from "react";

export interface ButtonProps {
  type?: 'button' | 'submit';
  children: ReactNode;
  btnStyle?: string;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
}
