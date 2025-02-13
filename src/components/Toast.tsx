import { Toast as BootstrapToast } from 'bootstrap';
import { forwardRef, memo, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import type { ToastRef, ToastType } from '../types/toast';

// forwardRef 用於轉發 ref
const Toast = forwardRef<ToastRef>((_props, ref) => {
  const toastRef = useRef<HTMLDivElement | null>(null);
  const toast = useRef<BootstrapToast | null>(null);
  const [toastText, setToastText] = useState<string>('');
  const [toastType, setToastType] = useState<ToastType>('success');

  // Toast 實體
  useEffect(() => {
    if (toastRef.current) {
      toast.current = new BootstrapToast(toastRef.current);
    }
  }, []);

  // 讓父元件可以呼叫子元件方法
  useImperativeHandle(ref, () => ({
    show: (text: string, type: ToastType) => {
      flushSync(() => {
        setToastText(text);
        setToastType(type);
      });
      toast.current?.show();
    }
  }));

  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3">
      <div id="toast" className={`toast text-bg-${toastType}`} role="alert" aria-live="assertive" aria-atomic="true" ref={toastRef}>
        <div className="toast-body d-flex">
          {toastText}
          <button type="button" className="btn-close ms-auto flex-shrink-0" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    </div>
  )
});

export default memo(Toast);
