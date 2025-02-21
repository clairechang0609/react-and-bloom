import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { setIsFullPageLoading } from "../../slice/loadingSlice";
import { useAppDispatch } from "../../store";
import { Product } from "../../types/product";
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const useGetProducts = ({ category, immediate = true, isShowLoading = true }: { category?: string, immediate?: boolean, isShowLoading?: boolean } = {}) => {
  const dispatch = useAppDispatch();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getProducts = useCallback(async () => {
    const params = new URLSearchParams();
    params.append('page', String(currentPage));
    if (category) params.append('category', category);

    try {
      if (isShowLoading) {
        dispatch(setIsFullPageLoading(true));
      }
      const res = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/products?${params.toString()}`);
      setProducts(res.data.products);
      setTotalPages(res.data.pagination?.total_pages);
      setCurrentPage(res.data.pagination?.current_page);
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err?.response?.data.message);
      }
    } finally {
      dispatch(setIsFullPageLoading(false));
    }
  }, [category, currentPage, dispatch, isShowLoading]);

  useEffect(() => {
    if (immediate) {
      getProducts();
    }
  }, [getProducts, category, currentPage, immediate]);

  return {
    products,
    getProducts,
    currentPage,
    setCurrentPage,
    totalPages
  }
}

export default useGetProducts;
