import { Toast as BootstrapToast } from 'bootstrap';
import { FC, memo, useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { toastData } from '../slice/toastSlice';
import type { Toast } from '../types/toast';

// forwardRef 用於轉發 ref
const Toast: FC = (() => {
  const toastRef = useRef<HTMLDivElement | null>(null);
  const toast = useRef<BootstrapToast | null>(null);
  const { text, type, id } = useSelector(toastData);

  // Toast 實體
  useEffect(() => {
    if (toastRef.current) {
      toast.current = new BootstrapToast(toastRef.current);
    }
  }, []);

  const showToast = useCallback(() => {
    toast.current?.show();
  }, []);

  useEffect(() => {
    if (id) {
      showToast();
    }
  }, [showToast, id]);

  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3">
      <div id="toast" className={`toast text-bg-${type}`} role="alert" aria-live="assertive" aria-atomic="true" ref={toastRef}>
        <div className="toast-body d-flex">
          {text}
          <button type="button" className="btn-close ms-auto flex-shrink-0" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    </div>
  )
});

export default memo(Toast);
