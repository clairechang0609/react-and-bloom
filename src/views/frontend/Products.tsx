import axios, { AxiosError } from 'axios';
import 'bootstrap';
import { useEffect, useState } from 'react';
import '../../assets/home.scss';
import ProductListItem from '../../components/frontend/ProductListItem';
import FullPageLoading from '../../components/FullPageLoading';
import Pagination from '../../components/Pagination';
import type { Product } from '../../types/product';
import { useAppDispatch } from '../../store';
import { asyncSetMessage } from '../../slice/toastSlice';
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const Products = () => {
  const dispatch = useAppDispatch();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [TotalPages, setTotalPages] = useState(1);
  const [isFullPageLoading, setIsFullPageLoading] = useState<boolean>(false);

  // 取得產品資料
  useEffect(() => {
    (async () => {
      try {
        setIsFullPageLoading(true);
        const res = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/products?page=${currentPage}`);
        setProducts(res.data.products);
        setTotalPages(res.data.pagination?.total_pages);
        setCurrentPage(res.data.pagination?.current_page);
      } catch (err) {
        if (err instanceof AxiosError) {
          console.log(err?.response?.data.message);
        }
      } finally {
        setIsFullPageLoading(false);
      }
    })()
  }, [currentPage]);

  // 加入購物車
  const addCart = async(productId?: string) => {
    try {
      setIsFullPageLoading(true);
      const res = await axios.post(`${VITE_API_BASE}/api/${VITE_API_PATH}/cart`, {
        data: {
          product_id: productId,
          qty: 1
        }
      });
      dispatch(asyncSetMessage({ text: res?.data.message, type: 'success' }));
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err?.response?.data.message);
        dispatch(asyncSetMessage({ text: err?.response?.data.message, type: 'danger' }));
      }
    } finally {
      setIsFullPageLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom">
        <h4 className="mb-0">產品列表</h4>
      </div>
      {products.map((item) => (
        <ProductListItem product={item} addCart={addCart} key={item.id} />
      ))}
      <div className="d-flex justify-content-center my-5">
        <Pagination currentPage={currentPage} totalPages={TotalPages} setCurrentPage={setCurrentPage} />
      </div>

      {isFullPageLoading && <FullPageLoading />}
    </div>
  )
}

export default Products;
