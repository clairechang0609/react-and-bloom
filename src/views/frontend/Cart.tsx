import axios, { AxiosError } from 'axios';
import 'bootstrap';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import '../../assets/home.scss';
import CartListItem from '../../components/frontend/CartListItem';
import CheckoutForm from '../../components/frontend/CheckoutForm';
import ProductCard from '../../components/frontend/ProductCard';
import { cartData } from '../../slice/cartSlice';
import type { CartItem } from '../../types/cart';
import Product from './Product';
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const Cart = () => {
  const { cart, total } = useSelector(cartData);
  const [products, setProducts] = useState<Product[]>([]);

  // 取得產品資料
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/products?page=1`);
        setProducts(res.data.products.slice(0, 6));
      } catch (err) {
        if (err instanceof AxiosError) {
          console.log(err?.response?.data.message);
        }
      }
    })()
  }, []);

  const swiperConfig = {
    modules: [ Autoplay ],
    autoplay: true,
    loop: true,
    spaceBetween: 16,
    slidesPerView: 1,
    centeredSlides: true,
    breakpoints: {
      575: {
        spaceBetween: 32,
        slidesPerView: 2
      },
      768: {
        spaceBetween: 48,
        slidesPerView: 2
      }
    }
  };

  return (
    <div className="container my-5">
      <div className="row g-4">
        <div className={cart.length ? 'col-md-6' : ''}>
          <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom">
            <h4 className="mb-0">購物車</h4>
          </div>
          {
            cart.length
              ? (<div className="list-group mb-4">
                {cart.map((item: CartItem) => (
                  <CartListItem item={item} key={item.id} />
                ))}
                <div className="list-group-item d-flex align-items-center justify-content-between p-3">
                  <strong>總金額</strong>
                  <strong>${total}</strong>
                </div>
              </div>)
              : <p className="text-center opacity-75 mt-5">購物車目前是空的，看看以下推薦商品 ↓</p>
          }
        </div>
        {
          cart.length
            ? <div className="col-md-6">
              <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom">
                <h4 className="mb-0">結帳</h4>
              </div>
              <div className="card">
                <div className="card-body">
                  <CheckoutForm />
                </div>
              </div>
            </div>
            : ''
        }
        <div>
          <div className="bg-light bg-opacity-75 text-center py-5">
            <h5 className="title fs-2">＼ Recommendations ／</h5>
            {
              products.length
                ? <Swiper {...swiperConfig} className="py-5">
                  {
                    products.map(item => {
                      return (
                        <SwiperSlide key={item.id}>
                          <ProductCard item={item} />
                        </SwiperSlide>
                      )
                    })
                  }
                </Swiper>
                : ''
            }
            <NavLink to="/products" className="btn btn-secondary rounded-pill px-5">
              PLANTS・所有植栽
              <span className="ms-3">→</span>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart;
