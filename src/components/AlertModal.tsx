import { Modal } from 'bootstrap';
import { forwardRef, memo, useEffect, useImperativeHandle, useRef } from 'react';
import type { AlertModalProps } from '../types/alert';
import type { ModalRef } from '../types/modal';
import Button from './Button';

const AlertModal = forwardRef<ModalRef, AlertModalProps>(({ children, nextFn }, ref) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const modal = useRef<Modal | null>(null);

  // Modal 實體
  useEffect(() => {
    if (modalRef.current) {
      modal.current = new Modal(modalRef.current);
    }
  }, []);

  // 讓父元件可以呼叫子元件方法
  useImperativeHandle(ref, () => ({
    show: () => {
      modal.current?.show();
    },
    hide: () => {
      modal.current?.hide();
    }
  }));

  return (
    <div className="modal fade" tabIndex={-1} ref={modalRef}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title fs-5">注意</h2>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {children}
          </div>
          <div className="modal-footer">
            <Button btnStyle="btn btn-outline-secondary" data-bs-dismiss="modal">取消</Button>
            <Button btnStyle="btn btn-secondary" handleClick={nextFn}>確認</Button>
          </div>
        </div>
      </div>
    </div>
  )
});

export default memo(AlertModal);
