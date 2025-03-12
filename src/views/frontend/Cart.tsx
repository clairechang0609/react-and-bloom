import axios, { AxiosError } from 'axios';
import 'bootstrap';
import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import CartListItem from '../../components/frontend/CartListItem';
import CheckoutForm from '../../components/frontend/CheckoutForm';
import ProductCard from '../../components/frontend/ProductCard';
import useGetProducts from '../../hooks/frontend/useGetProducts';
import { asyncAddCart, asyncGetCart, cartData } from '../../slice/cartSlice';
import { useAppDispatch } from "../../store";
import type { CartItem } from '../../types/cart';
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const Cart = () => {
  const dispatch = useAppDispatch();
  const { cart, total, final_total, coupon } = useSelector(cartData);
  const { products } = useGetProducts();
  const filterProducts = useMemo(() => {
    return products?.slice(0, 3) || [];
  }, [products]);
  const [tempCoupon, setTempCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState({ type: '', msg: '' });
  const [isLoading, setIsLoading] = useState(false);

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

  // 送出優惠券
  const submitCoupon = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.post(`${VITE_API_BASE}/api/${VITE_API_PATH}/coupon`, {
        data: { code: tempCoupon }
      });
      setCouponMsg({
        type: 'success',
        msg: res?.data.message
      });
      dispatch(asyncGetCart({ isShowLoading: false }));
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err?.response?.data.message);
        setCouponMsg({
          type: 'danger',
          msg: err?.response?.data.message
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, tempCoupon]);

  return (
    <>
      <div className="container my-5">
        <div className="row bg-white g-0">
          <div className={`p-4 p-lg-5 ${cart.length ? 'col-md-7' : ''}`}>
            <div className="d-flex align-items-center pb-3 mb-4">
              <h3 className="title fs-2 mb-0 me-3">Your Cart</h3>
              <small className="mt-2">購｜物｜車</small>
            </div>
            {
              cart.length
                ? (<div className="mb-4">
                    {cart.map((item: CartItem) => (
                      <CartListItem item={item} key={item.id} />
                    ))}
                    <div className="text-end mt-5 mb-3">
                      <div className="input-group">
                        <input type="text" className="form-control form-control-sm w-auto" placeholder="請輸入優惠券代碼" value={tempCoupon} onChange={(e) => setTempCoupon(e.target.value)} />
                        <button className="btn btn-sm btn-secondary" type="button" onClick={submitCoupon} disabled={!tempCoupon}>
                          使用優惠券
                          {isLoading && <span className="spinner-grow spinner-grow-sm ms-2"></span>}
                        </button>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mt-1">
                        <span className="fs-tiny">* 加入商品需重新套用優惠券</span>
                        { couponMsg.type ? <small className={`ms-auto fs-tiny text-${couponMsg.type}`}>{couponMsg.msg}</small> : '' }
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-body p-2">
                        <div className="border-bottom mb-2 pb-2 d-flex align-items-center justify-content-between">
                          <small>小計</small>
                          <small>${total}</small>
                        </div>
                        <div className="border-bottom mb-2 pb-2 d-flex align-items-start justify-content-between">
                          <small>優惠券折扣{ coupon ? `（${coupon.title} ${coupon.percent} 折）`: '' }</small>
                          <small className="text-danger">{ total - Math.round(final_total) > 0 ? `-${total - Math.round(final_total)}` : '' }</small>
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                          <strong>總金額</strong>
                          <strong>${Math.round(final_total)}</strong>
                        </div>
                      </div>
                    </div>
                </div>)
                : <p className="text-center opacity-75 mt-5">購物車目前是空的，看看以下推薦商品 ↓</p>
            }
          </div>
          {
            cart.length
              ? <div className="p-4 p-lg-5 col-md-5" style={{ backgroundColor: 'var(--tertiary)' }}>
                  <div className="d-flex align-items-center pb-3 mb-4">
                    <h3 className="title fs-2 mb-0 me-3">Checkout</h3>
                    <small className="mt-2">結｜帳</small>
                  </div>
                  <CheckoutForm />
                </div>
                : ''
          }
        </div>
        <div className="py-5 mt-2">
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
                        <ProductCard isLink={true} item={item}>
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
