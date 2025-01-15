import { FC } from 'react';
import type { ToastProps } from '../types/toast';

// 提示訊息
const Toast: FC<ToastProps> = ({ toastRef, toastText, type = 'success' }) => {
  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3">
      <div id="toast" className={`toast text-bg-${type}`} role="alert" aria-live="assertive" aria-atomic="true" ref={toastRef}>
        <div className="toast-body d-flex">
          {toastText}
          <button type="button" className="btn-close ms-auto flex-shrink-0" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    </div>
  )
}

export default Toast;
