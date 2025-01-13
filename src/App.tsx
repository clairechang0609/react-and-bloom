import { useState, useRef, useEffect, SetStateAction, Dispatch, FC, ChangeEvent, MutableRefObject } from 'react';
import axios, { AxiosError } from 'axios';
import './assets/home.scss';
import { Toast } from 'bootstrap';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import ProductListItem from './components/ProductListItem';
import TempProductCard from './components/TempProductCard';
import Pagination from './components/Pagination';
import type { Product } from './types/product';

const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

// 設定 Authorization
const setAuthorization = () => {
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)andBloom\s*=\s*([^;]*).*$)|^.*$/,"$1",);
  axios.defaults.headers.common.Authorization = token;
}

const App = () => {
  const [isLogin, setIsLogin] = useState<boolean | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [tempProduct, setTempProduct] = useState<Product | null>(null);
  const toastRef = useRef<HTMLDivElement | null>(null);
  const toastInstance = useRef<Toast | null>(null);
  const [toastText, setToastText] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [TotalPages, setTotalPages] = useState(1);

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
          ? <div className="container mt-5 mb-5">
              <h3 className="pb-3 mb-3 border-bottom">產品列表</h3>
              <div className="row gx-3 gx-lg-4 mt-5">
                <div className="col-md-4 mb-3 mb-md-0">
                  <ul className="list-group">
                    {products.map((item) => (
                      <ProductListItem product={item} setTempProduct={setTempProduct} key={item.id} />
                    ))}
                  </ul>
                </div>
                <div className="col-md-8">
                  <TempProductCard tempProduct={tempProduct} />
                </div>
              </div>
            </div>
          : isLogin !== null && <LoginForm setIsLogin={setIsLogin} toast={toastInstance} setToastText={setToastText} />
      }
      <div className="d-flex justify-content-center my-5">
        <Pagination currentPage={currentPage} totalPages={TotalPages} setCurrentPage={setCurrentPage} />
      </div>
      <Notification toastRef={toastRef} toastText={toastText} />
    </>
  )
}

export default App;
