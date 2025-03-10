import { CouponItem } from "./coupon";
import { Product } from "./product";

export interface OrderProductDetail {
  id: string;
  product_id: string;
  product: Product;
  qty: number;
  total: number;
  final_total: number;
  coupon?: CouponItem;
}

export interface Order {
  create_at: number;
  id: string;
  is_paid: boolean;
  message: string;
  products: {
    [key: string]: OrderProductDetail;
  };
  user: {
    address: string;
    email: string;
    name: string;
    tel: string;
  };
  num: number;
  total: number;
  remark?: string;
  paid_date?: number;
}

export interface OrderWithCoupon extends Order {
  discount?: number;
  coupon?: CouponItem
}

export interface AdminOrderListItemProps {
  showModal: () => void;
  order: OrderWithCoupon;
  showAlertModal: () => void;
  setSelectedOrder: (value: (Order & {
    discount?: number;
    coupon?: CouponItem}) | null) => void;
}

export interface AdminOrderModalProps {
  selectedOrder: OrderWithCoupon | null;
  getOrders: () => void;
}
