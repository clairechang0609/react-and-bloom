import axios, { AxiosError } from 'axios';
import 'bootstrap';
import { useEffect, useState } from 'react';
import '../../assets/home.scss';
import CartListItem from '../../components/frontend/CartListItem';
import CheckoutForm from '../../components/frontend/CheckoutForm';
import FullPageLoading from '../../components/FullPageLoading';
import type { CartItem } from '../../types/cart';
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const Cart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isFullPageLoading, setIsFullPageLoading] = useState<boolean>(false);

  // 取得購物車
  const getCart = async() => {
    try {
      setIsFullPageLoading(true);
      const res = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/cart`);
      setCart(res.data.data?.carts);
      setTotal(res.data.data?.total);
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
    <div className="container my-5">
      <div className="row row-cols-1 row-cols-md-2 g-4">
        <div className="col-md-6">
          <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom">
            <h4 className="mb-0">購物車</h4>
          </div>
          <div className="list-group mb-4">
            {cart.map((item: CartItem) => (
              <CartListItem item={item} key={item.id} setIsFullPageLoading={setIsFullPageLoading} getCart={getCart} />
            ))}
            <div className="list-group-item d-flex align-items-center justify-content-between p-3">
              <strong>總金額</strong>
              <strong>${total}</strong>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom">
            <h4 className="mb-0">結帳</h4>
          </div>
          {
            cart.length
              ? <div className="card">
                  <div className="card-body">
                    <CheckoutForm setIsFullPageLoading={setIsFullPageLoading} getCart={getCart} />
                  </div>
                </div>
              : <p className="opacity-75">尚未選購商品</p>
          }
        </div>
      </div>

      {isFullPageLoading && <FullPageLoading />}
    </div>
  )
}

export default Cart;
