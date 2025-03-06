import 'bootstrap';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router';
import styled, { createGlobalStyle } from 'styled-components';
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

const CartWrap = styled("div")`
  background-color: var(--tertiary);
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
      <div className="container p-0 my-5">
        <div className="row bg-white g-0">
          <div className={`p-4 p-lg-5 ${cart.length ? 'col-md-7' : ''}`}>
            <div className="d-flex align-items-center pb-3 mb-4">
              <h3 className="title fs-2 mb-0 me-3">Your Cart</h3>
              <small className="mt-2">購｜物｜車</small>
            </div>
            {
              cart.length
                ? (<div className="list-group mb-4">
                  {cart.map((item: CartItem) => (
                    <CartListItem item={item} key={item.id} />
                  ))}
                  <div className="list-group-item border-0 rounded-0 px-4 d-flex align-items-center justify-content-between p-3">
                    <strong>總金額</strong>
                    <strong>${total}</strong>
                  </div>
                </div>)
                : <p className="text-center opacity-75 mt-5">購物車目前是空的，看看以下推薦商品 ↓</p>
            }
          </div>
          {
            cart.length
              ? <CartWrap className=" p-4 p-lg-5 col-md-5">
                  <div className="d-flex align-items-center pb-3 mb-4">
                    <h3 className="title fs-2 mb-0 me-3">Checkout</h3>
                    <small className="mt-2">結｜帳</small>
                  </div>
                  <CheckoutForm />
                </CartWrap>
                : ''
          }
        </div>
        <div className="text-center py-5 mt-2">
          <div className="d-flex flex-column align-items-center text-center">
            <h5 className="title text-center fs-4 mb-2">＼ Recommendations ／</h5>
            <small className="d-block">精選商品</small>
          </div>
          {
            filterProducts.length
              ? <Swiper {...swiperConfig} className="py-4">
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
        </div>
      </div>
    </>
  )
}

export default Cart;
