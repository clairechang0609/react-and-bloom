import 'bootstrap';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router';
import { createGlobalStyle } from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import CartListItem from '../../components/frontend/CartListItem';
import CheckoutForm from '../../components/frontend/CheckoutForm';
import ProductCard from '../../components/frontend/ProductCard';
import useGetProducts from '../../hooks/frontend/useGetProducts';
import { asyncAddCart, cartData } from '../../slice/cartSlice';
import { useAppDispatch } from "../../store";
import type { CartItem } from '../../types/cart';

const Global = createGlobalStyle`
  .swiper-slide.swiper-slide-active .image-wrap {
    aspect-ratio: 3 / 4;
    transition: aspect-ratio 0.5s ease-out;
  }

  .swiper-slide .image-wrap {
    transition: 0.25s ease-in 0.5s;
  }
`;

const Cart = () => {
  const dispatch = useAppDispatch();
  const { cart, total } = useSelector(cartData);
  const { products } = useGetProducts();
  const filterProducts = useMemo(() => {
    return products?.slice(0, 3);
  }, [products]);

  const swiperConfig = {
    spaceBetween: 16,
    slidesPerView: 1,
    initialSlide: 1,
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

  const addCart = (e: React.MouseEvent<HTMLButtonElement>, id: string | undefined) => {
    e.preventDefault();
    dispatch(asyncAddCart({ productId: id }))
  }

  return (
    <>
      <Global />
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
                filterProducts.length
                  ? <Swiper {...swiperConfig} className="py-5">
                    {
                      filterProducts.map(item => {
                        return (
                          <SwiperSlide className="align-self-center" key={item.id}>
                            <ProductCard item={item}>
                              <button type="button" className="btn btn-sm btn-secondary rounded-pill px-4 mt-3" onClick={(e) => addCart(e, item.id)}>
                                加入購物車
                              </button>
                            </ProductCard>
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
    </>
  )
}

export default Cart;
