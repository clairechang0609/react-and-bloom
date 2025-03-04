import { FC, memo, useCallback } from 'react';
import styled from 'styled-components';
import Button from '../Button';
import StatusIcon from '../StatusIcon';
import { AdminCouponListItemProps, CouponItem } from '../../types/coupon';

const CouponWrap = styled("li")`
  margin-top: -1px;
  &:hover {
    background-color: #f8f9fa;
    z-index: 1000;
    border-color: rgba(0, 0, 0, 0.3);
  }
`;

const CouponListItem: FC<AdminCouponListItemProps> = memo(({ showModal, coupon, setSelectedCoupon, showAlertModal }) => {
  const { id, title, is_enabled, percent, due_date, code } = coupon;

  const editForm = useCallback((coupon: CouponItem) => {
    setSelectedCoupon(coupon);
    showModal();
  }, [showModal, setSelectedCoupon]);

  const deleteOrder = useCallback((coupon: CouponItem) => {
    setSelectedCoupon(coupon);
    showAlertModal();
  }, [showAlertModal, setSelectedCoupon]);

  const timeFormat = () => {
    const date = new Date(due_date * 1000); // 轉換為毫秒

    // 轉換為台灣時區 (UTC+8)
    const taiwanDate = new Intl.DateTimeFormat('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Taipei'
    }).format(date);

    // 轉換為 yyyy-mm-dd 格式
    return taiwanDate.replace(/\//g, '-');
  }

  return (
    <CouponWrap className="card mb-3">
      <div className="card-body">
        <div className="row w-100 justify-content-between align-items-center">
          <div className="col-md-2">
            <p className="mb-0 ms-4">{title}</p>
          </div>
          <div className="col-md-2">
            <span className="badge rounded-pill bg-primary fs-sm mb-1">折扣碼</span>
            <p className="mb-0">{code}</p>
          </div>
          <div className="col-md-2">
            <span className="badge rounded-pill bg-primary fs-sm mb-1">折扣數</span>
            <p className="mb-0">{percent} %</p>
          </div>
          <div className="col-md-2">
            <span className="badge rounded-pill bg-primary fs-sm mb-1">到期日</span>
            <p className="mb-0">{timeFormat()}</p>
          </div>
          <div className="col-md d-flex justify-content-center">
            <StatusIcon isEnabled={is_enabled} labels={['停用', '啟用']} />
          </div>
          <div className="col-md d-flex align-items-center justify-content-end">
            <Button btnStyle="btn-sm btn-secondary" handleClick={() => editForm(coupon)}>編輯</Button>
            <Button btnStyle="btn-sm btn-outline-primary ms-2" handleClick={() => deleteOrder(coupon)}>
              刪除
            </Button>
          </div>
        </div>
      </div>
    </CouponWrap>
  )
});

export default CouponListItem;
