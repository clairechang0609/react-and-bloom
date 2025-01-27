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
  alertModal: RefObject<Modal>;
  setSelectedProduct: (value: Product | null) => void;
}

export interface ProductModalProps {
  modalRef: RefObject<HTMLDivElement>;
  selectedProduct: Product | null;
  getProducts: () => void;
  showToast: (message: string, type: ToastType) => void;
  modal: RefObject<Modal>;
  setIsFullPageLoading: (value: boolean) => void;
}
