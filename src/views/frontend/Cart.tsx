import 'bootstrap';
import { useSelector } from 'react-redux';
import '../../assets/home.scss';
import CartListItem from '../../components/frontend/CartListItem';
import CheckoutForm from '../../components/frontend/CheckoutForm';
import { cartData } from '../../slice/cartSlice';
import type { CartItem } from '../../types/cart';

const Cart = () => {
  const { cart, total } = useSelector(cartData);

  return (
    <div className="container my-5">
      <div className="row row-cols-1 row-cols-md-2 g-4">
        <div className="col-md-6">
          <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom">
            <h4 className="mb-0">購物車</h4>
          </div>
          <div className="list-group mb-4">
            {cart.map((item: CartItem) => (
              <CartListItem item={item} key={item.id} />
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
                    <CheckoutForm />
                  </div>
                </div>
              : <p className="opacity-75">尚未選購商品</p>
          }
        </div>
      </div>
    </div>
  )
}

export default Cart;
