import { RefObject } from "react";
import { Modal } from "bootstrap";
import type { ToastType } from "./toast";

export interface Product {
  id?: string;
  category: string;
  content: string;
  origin_price: number | null;
  price: number | null;
  description: string;
  is_enabled: boolean;
  title: string;
  unit: string;
  num: number;
  imageUrl: string;
  imagesUrl: string[];
  petCareNotes?: string;
  floriography?: string;
}

export interface ProductListItemProps {
  product: Product;
  modal: RefObject<Modal>;
  setSelectedProduct: (value: Product | null) => void;
  addCart: (productId?: string) => void;
}

export interface ProductModalProps {
  modalRef: RefObject<HTMLDivElement>;
  modal: RefObject<Modal>;
  selectedProduct: Product | null;
  addCart: (productId?: string) => void;
}
