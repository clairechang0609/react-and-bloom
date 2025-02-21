import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { Product } from "../../types/product";
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const useGetProducts = ({ page, category }: { page?: number, category?: string }) => {
  const [products, setProducts] = useState<Product[]>([]);

  const getProducts = useCallback(async () => {
    const params = new URLSearchParams();
    if (page) params.append('page', String(page));
    if (category) params.append('category', category);

    try {
      const res = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/products?${params.toString()}`);
      setProducts(res.data.products);
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err?.response?.data.message);
      }
    }
  }, [page, category]);

  useEffect(() => {
    if (page || category) {
      getProducts();
    }
  }, [getProducts, page, category]);

  return {
    products,
    getProducts
  }
}

export default useGetProducts;
