import { useState, useRef, useEffect, FC, ReactNode, RefObject, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import 'bootstrap';
import './assets/home.scss';
import { Toast, Modal } from 'bootstrap';
import { flushSync } from 'react-dom';
import AlertToast from './components/Toast';
import ProductListItem from './components/ProductListItem';
import Pagination from './components/Pagination';
import ProductModal from './components/ProductModal';
import AlertModal from './components/AlertModal';
import Button from './components/Button';
import type { Product } from './types/product';
import type { ToastType } from './types/toast';
import styled from 'styled-components';

const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const LoadingContainer = styled("div")`
  z-index: 2000;
`;

const App = () => {
  const [isLogin, setIsLogin] = useState<boolean | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [toastText, setToastText] = useState<string>('');
  const [toastType, setToastType] = useState<ToastType>('success');
  const [currentPage, setCurrentPage] = useState(1);
  const [TotalPages, setTotalPages] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFullPageLoading, setIsFullPageLoading] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const modal = useRef<Modal | null>(null);
  const alertModalRef = useRef<HTMLDivElement | null>(null);
  const alertModal = useRef<Modal | null>(null);
  const toastRef = useRef<HTMLDivElement | null>(null);
  const toast = useRef<Toast | null>(null);

  // Modal & Toast 實體
  useEffect(() => {
    if (modalRef.current) {
      modal.current = new Modal(modalRef.current);
    }
    if (alertModalRef.current) {
      alertModal.current = new Modal(alertModalRef.current);
    }
    if (toastRef.current) {
      toast.current = new Toast(toastRef.current);
    }
  }, []);

  // 顯示提示訊息
  const showToast = useCallback((text: string, type: ToastType) => {
    flushSync(() => {
      setToastText(text);
      setToastType(type);
    });
    toast.current?.show();
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
  }, [currentPage]);

  // 新增產品
  // const addProduct = useCallback(() => {
  //   console.log('addProduct');
  //   setSelectedProduct(null);
  //   modal.current?.show();
  // }, []);

  // 刪除商品
  // const deleteProduct = useCallback(async (id: string) => {
  //   if (!id) return;

  //   try {
  //     setIsFullPageLoading(true);
  //     const res = await axios.delete(`${VITE_API_BASE}/api/${VITE_API_PATH}/admin/product/${id}`);
  //     showToast(res.data.message, 'success');
  //     getProducts();
  //     setIsFullPageLoading(false);
  //     setSelectedProduct(null);
  //     alertModal.current?.hide();
  //   } catch (err) {
  //     if (err instanceof AxiosError) {
  //       console.log(err?.response?.data.message);
  //       showToast(err?.response?.data.message, 'danger');
  //       setIsFullPageLoading(false);
  //       setSelectedProduct(null);
  //     }
  //   }
  // }, [getProducts, showToast]);

  return (
    <>
      <div className="container my-5">
        <div className="row row-cols-1 row-cols-md-2 g-4">
          <div className="col-md-8">
            <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom">
              <h4 className="mb-0">產品列表</h4>
            </div>
            {products.map((item) => (
              <ProductListItem modal={modal} setSelectedProduct={setSelectedProduct} product={item} key={item.id} />
            ))}
            <div className="d-flex justify-content-center my-5">
              <Pagination currentPage={currentPage} totalPages={TotalPages} setCurrentPage={setCurrentPage} />
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom">
                <h4 className="mb-0">購物車</h4>
              </div>
          </div>
        </div>
      </div>

      <ProductModal
        modalRef={modalRef}
        selectedProduct={selectedProduct}
      />

      {/* <AlertModal alertModalRef={alertModalRef} nextFn={() => deleteProduct(selectedProduct?.id || '')}>
        <p className="text-center py-4">刪除後無法復原，您確定刪除<strong>{selectedProduct?.title}</strong>嗎？</p>
      </AlertModal> */}

      <AlertToast toastRef={toastRef} toastText={toastText} type={toastType} />

      {isFullPageLoading && <LoadingContainer className="fixed-top w-100 h-100 bg-white bg-opacity-75 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary">
          <span className="visually-hidden">Loading...</span>
        </div>
      </LoadingContainer>}
    </>
  )
}

export default App;
