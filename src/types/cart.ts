import { Product } from "./product";

export interface CartItem {
  final_total: number;
  id: string;
  product: Product;
  product_id: string;
  qty: number;
  total: number;
}
