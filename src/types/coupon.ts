export interface CouponItem {
  id?: string;
  title: string;
  is_enabled: 1 | 0,
  percent: number,
  due_date: number,
  code: string
}

export interface AdminCouponListItemProps {
  showModal: () => void;
  coupon: CouponItem;
  showAlertModal: () => void;
  setSelectedCoupon: (value: CouponItem | null) => void;
}

export interface AdminCouponModalProps {
  selectedCoupon: CouponItem | null;
  getCoupons: () => void;
}
