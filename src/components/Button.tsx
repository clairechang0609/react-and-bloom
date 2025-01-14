import { FC } from 'react';
import type { ButtonProps } from '../types/button';

const Button: FC<ButtonProps> = ({ type = 'button', children, btnStyle = 'btn-secondary', handleClick = () => {}, ...props }) => {
  return (
    <button type={type} className={`btn rounded-pill px-3 ${btnStyle}`} onClick={handleClick} {...props}>
      {children}
    </button>
  )
}

export default Button;
