import axios, { AxiosError } from 'axios';
import 'bootstrap';
import { Modal } from 'bootstrap';
import { useEffect, useRef, useState } from 'react';
import '../../assets/home.scss';
import CartListItem from '../../components/frontend/CartListItem';
import CheckoutForm from '../../components/frontend/CheckoutForm';
import FullPageLoading from '../../components/FullPageLoading';
import AlertToast from '../../components/Toast';
import type { CartItem } from '../../types/cart';
import type { ToastRef, ToastType } from '../../types/toast';
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const Cart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isFullPageLoading, setIsFullPageLoading] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const modal = useRef<Modal | null>(null);
  const alertModalRef = useRef<HTMLDivElement | null>(null);
  const alertModal = useRef<Modal | null>(null);
  const toastRef = useRef<ToastRef | null>(null);

  // Modal 實體
  useEffect(() => {
    if (modalRef.current) {
      modal.current = new Modal(modalRef.current);
    }
    if (alertModalRef.current) {
      alertModal.current = new Modal(alertModalRef.current);
    }
  }, []);

  // 顯示提示訊息
  const showToast = (text: string, type: ToastType) => {
    toastRef.current?.show(text, type);
  };

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

  return (
    <>
      <div className="row row-cols-1 row-cols-md-2 g-4">
        <div className="col-md-8">
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
        </div>
        <div className="col-md-4">
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

      <AlertToast ref={toastRef} />

      {isFullPageLoading && <FullPageLoading />}
    </>
  )
}

export default Cart;
