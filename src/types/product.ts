import { SetStateAction, Dispatch } from 'react';

export interface Product {
  id: string;
  category: string;
  content: string;
  origin_price: number;
  price: number;
  description: string;
  is_enabled: 0 | 1;
  title: string;
  unit: string;
  num: number;
  imageUrl: string;
  imagesUrl: string[];
}

export interface ProductListItemProps {
  product: Product;
  setTempProduct: Dispatch<SetStateAction<Product | null>>;
}
