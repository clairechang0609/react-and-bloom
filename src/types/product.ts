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

export interface AdminProductModalProps {
  selectedProduct: Product | null;
  getProducts: () => void;
}

export interface AdminProductListItemProps {
  showModal: () => void;
  product: Product;
  showAlertModal: () => void;
  setSelectedProduct: (value: Product | null) => void;
}
