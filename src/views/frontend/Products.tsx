import axios, { AxiosError } from 'axios';
import 'bootstrap';
import { Modal } from 'bootstrap';
import { useCallback, useEffect, useRef, useState } from 'react';
import '../../assets/home.scss';
import ProductListItem from '../../components/frontend/ProductListItem';
import ProductModal from '../../components/frontend/ProductModal';
import FullPageLoading from '../../components/FullPageLoading';
import Pagination from '../../components/Pagination';
import AlertToast from '../../components/Toast';
import type { Product } from '../../types/product';
import type { ToastRef, ToastType } from '../../types/toast';
import { ModalRef } from '../../types/modal';
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [TotalPages, setTotalPages] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFullPageLoading, setIsFullPageLoading] = useState<boolean>(false);
  const modalRef = useRef<ModalRef | null>(null);
  const alertModalRef = useRef<ModalRef | null>(null);
  const toastRef = useRef<ToastRef | null>(null);

  // 顯示提示訊息
  const showToast = useCallback((text: string, type: ToastType) => {
    toastRef.current?.show(text, type);
  }, []);

  // 顯示 Modal
  const showModal = useCallback(() => {
    modalRef.current?.show();
  }, []);

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
  }, [currentPage, showToast]);

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
      showToast(res?.data.message, 'success');
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err?.response?.data.message);
      }
    } finally {
      setIsFullPageLoading(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom">
        <h4 className="mb-0">產品列表</h4>
      </div>
      {products.map((item) => (
        <ProductListItem showModal={showModal} setSelectedProduct={setSelectedProduct} product={item} key={item.id}
          addCart={addCart} />
      ))}
      <div className="d-flex justify-content-center my-5">
        <Pagination currentPage={currentPage} totalPages={TotalPages} setCurrentPage={setCurrentPage} />
      </div>

      <ProductModal
        ref={modalRef}
        selectedProduct={selectedProduct}
        addCart={addCart}
      />

      <AlertToast ref={toastRef} />

      {isFullPageLoading && <FullPageLoading />}
    </>
  )
}

export default Products;
