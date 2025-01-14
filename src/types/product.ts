import { SetStateAction, Dispatch, RefObject, MutableRefObject } from "react";
import { Modal } from 'bootstrap';
import type { Toast } from 'bootstrap';

export interface Product {
  id?: string;
  category: string;
  content: string;
  origin_price: number | null;
  price: number | null;
  description: string;
  is_enabled: '0' | '1';
  title: string;
  unit: string;
  num: number;
  imageUrl: string;
  imagesUrl: string[];
}

export interface ProductListItemProps {
  product: Product;
  modalInstance: RefObject<Modal>;
  setIsNewProduct: (value: boolean) => void;
}

export interface ProductModalProps {
  modalRef: RefObject<HTMLDivElement>;
  toast: MutableRefObject<Toast | null>;
  isNewProduct: boolean;
  setToastText: Dispatch<SetStateAction<string>>;
  getProducts: () => void;
}
