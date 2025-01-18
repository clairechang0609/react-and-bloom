import { FC, memo } from 'react';
import Button from './Button';
import type { AlertModalProps } from '../types/alert';

const AlertModal: FC<AlertModalProps> = memo(({ alertModalRef, children, nextFn }) => {
  return (
    <div className="modal fade" tabIndex={-1} ref={alertModalRef}>
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
            <Button type="button" btnStyle="btn btn-secondary" handleClick={nextFn}>確認</Button>
          </div>
        </div>
      </div>
    </div>
  )
});

export default AlertModal;
