import axios, { AxiosError } from 'axios';
import 'bootstrap';
import { Modal, Toast } from 'bootstrap';
import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import styled from 'styled-components';
import '../assets/home.scss';
import CartListItem from '../components/CartListItem';
import CheckoutForm from '../components/CheckoutForm';
import Pagination from '../components/Pagination';
import ProductListItem from '../components/ProductListItem';
import ProductModal from '../components/ProductModal';
import AlertToast from '../components/Toast';
import type { CartItem } from '../types/cart';
import type { Product } from '../types/product';
import type { ToastType } from '../types/toast';

const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const LoadingContainer = styled("div")`
  z-index: 2000;
`;

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);
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

  // 取得購物車
  const getCart = async() => {
    try {
      setIsFullPageLoading(true);
      const res = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/cart`);
      setCart(res.data.data?.carts);
      setTotal(res.data.data?.total);
      console.log(res.data.data);
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err?.response?.data.message);
      }
    } finally {
      setIsFullPageLoading(false);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  // 加入購物車
  const addCart = async(productId?: string) => {
    try {
      setIsFullPageLoading(true);
      await axios.post(`${VITE_API_BASE}/api/${VITE_API_PATH}/cart`, {
        data: {
          product_id: productId,
          qty: 1
        }
      });
      getCart();
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
      <div className="container my-5">
        <div className="row row-cols-1 row-cols-md-2 g-4">
          <div className="col-md-8">
            <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom">
              <h4 className="mb-0">產品列表</h4>
            </div>
            {products.map((item) => (
              <ProductListItem modal={modal} setSelectedProduct={setSelectedProduct} product={item} key={item.id}
                addCart={addCart} />
            ))}
            <div className="d-flex justify-content-center my-5">
              <Pagination currentPage={currentPage} totalPages={TotalPages} setCurrentPage={setCurrentPage} />
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom">
              <h4 className="mb-0">購物車</h4>
            </div>
            <div className="list-group mb-4">
              {cart.map((item: CartItem) => (
                <CartListItem item={item} key={item.id} setIsFullPageLoading={setIsFullPageLoading} getCart={getCart} />
              ))}
              <div className="list-group-item d-flex align-items-center justify-content-between p-3">
                總金額<strong>${total}</strong>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom">
              <h4 className="mb-0">結帳</h4>
            </div>
            {
              cart.length
                ? <div className="card">
                    <div className="card-body">
                      <CheckoutForm setIsFullPageLoading={setIsFullPageLoading} showToast={showToast} getCart={getCart} />
                    </div>
                  </div>
                : <p className="opacity-75">尚未選購商品</p>
            }
          </div>
        </div>
      </div>

      <ProductModal
        modalRef={modalRef}
        modal={modal}
        selectedProduct={selectedProduct}
        addCart={addCart}
      />

      <AlertToast toastRef={toastRef} toastText={toastText} type={toastType} />

      {isFullPageLoading && <LoadingContainer className="fixed-top w-100 h-100 bg-white bg-opacity-75 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary">
          <span className="visually-hidden">Loading...</span>
        </div>
      </LoadingContainer>}
    </>
  )
}

export default Home;
