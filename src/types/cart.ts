import { Product } from "./product";

export interface CartItem {
  final_total: number;
  id: string;
  product: Product;
  product_id: string;
  qty: number;
  total: number;
}

export interface CartListItemProp {
  item: CartItem;
  setIsFullPageLoading: (value: boolean) => void;
  getCart: () => void;
}

export interface CheckoutFormProps {
  setIsFullPageLoading: (value: boolean) => void;
  showToast: (text: string, type: 'success' | 'danger') => void;
  getCart: () => void;
}
