import { Product } from "./product";

export interface OrderProductDetail {
  id: string;
  product_id: string;
  product: Product;
  qty: number;
  total: number;
  final_total: number;
}

export interface Order {
  create_at: number | string;
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
}

export interface AdminOrderListItemProps {
  showModal: () => void;
  order: Order;
  showAlertModal: () => void;
  setSelectedOrder: (value: Order | null) => void;
}

export interface AdminOrderModalProps {
  selectedOrder: Order | null;
  getOrders: () => void;
}
