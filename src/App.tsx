import { useState, useRef, useEffect, FC, ReactNode, RefObject } from 'react';
import axios, { AxiosError } from 'axios';
import './assets/home.scss';
import { Toast, Modal } from 'bootstrap';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import ProductListItem from './components/ProductListItem';
import Pagination from './components/Pagination';
import ProductModal from './components/ProductModal';
import type { Product } from './types/product';
import 'bootstrap';

const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

// 設定 Authorization
const setAuthorization = () => {
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)andBloom\s*=\s*([^;]*).*$)|^.*$/,"$1",);
  axios.defaults.headers.common.Authorization = token;
}

const App = () => {
  const [isLogin, setIsLogin] = useState<boolean | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const toastRef = useRef<HTMLDivElement | null>(null);
  const toastInstance = useRef<Toast | null>(null);
  const [toastText, setToastText] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [TotalPages, setTotalPages] = useState(1);

  const modalRef = useRef<HTMLDivElement | null>(null);
  const modalInstance = useRef<Modal | null>(null);
  const [isNewProduct, setIsNewProduct] = useState<boolean>(true);

  useEffect(() => {
    if (modalRef.current) {
      modalInstance.current = new Modal(modalRef.current);
    }
  }, [])

  const OpenModal = () => {
    modalInstance.current?.show();
  }

  // 檢查登入是否過期
  useEffect(() => {
    (async () => {
      try {
        setAuthorization();
        await axios.post(`${VITE_API_BASE}/api/user/check`);
        setIsLogin(true);
      } catch (err) {
        if (err instanceof AxiosError) {
          console.log(err?.response?.data.message);
          setToastText(err?.response?.data.message);
        }
        setIsLogin(false);
      }
    })();
  }, []);

  // 取得商品列表
  useEffect(() => {
    if (isLogin) {
      (async () => {
        try {
          setAuthorization();
          const res = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/admin/products?page=${currentPage}`);
          setProducts(res.data.products);
          setTotalPages(res.data.pagination?.total_pages);
          setCurrentPage(res.data.pagination?.current_page);
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [currentPage, isLogin]);

  // toast
  useEffect(() => {
    if (toastRef.current) {
      toastInstance.current = new Toast(toastRef.current);
    }
  }, []);

  return (
    <>
      {
        isLogin
          ? <>
              <div className="container my-5">
                <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom">
                  <h3 className="mb-0">產品列表</h3>
                  <button type="button" className="btn btn-secondary btn-sm rounded-pill px-3"
                    onClick={OpenModal}>
                    新增
                  </button>
                </div>
                {
                  products.length
                  ? <>
                      {products.map((item) => (
                        <ProductListItem modalInstance={modalInstance} setIsNewProduct={setIsNewProduct}
                          product={item} key={item.id} />
                      ))}
                      <div className="d-flex justify-content-center my-5">
                        <Pagination currentPage={currentPage} totalPages={TotalPages} setCurrentPage={setCurrentPage} />
                      </div>
                    </>
                  : <p className="text-center">尚無產品，請新增產品</p>
                }
              </div>
            </>
          : isLogin !== null && <LoginForm setIsLogin={setIsLogin} toast={toastInstance} setToastText={setToastText} />
      }
      <ProductModal modalRef={modalRef} isNewProduct={isNewProduct} />
      <Notification toastRef={toastRef} toastText={toastText} />
    </>
  )
}

export default App;
