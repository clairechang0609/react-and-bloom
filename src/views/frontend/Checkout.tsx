import 'bootstrap';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useParams } from 'react-router';
import styled, { createGlobalStyle } from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import CartListItem from '../../components/frontend/CartListItem';
import CheckoutForm from '../../components/frontend/CheckoutForm';
import ProductCard from '../../components/frontend/ProductCard';
import useGetProducts from '../../hooks/frontend/useGetProducts';
import { asyncAddCart, cartData } from '../../slice/cartSlice';
import { useAppDispatch } from "../../store";
import type { CartItem } from '../../types/cart';
import { setIsFullPageLoading } from '../../slice/loadingSlice';
import axios, { AxiosError } from 'axios';
import { Order } from '../../types/order';
import Button from '../../components/Button';
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const Message = styled("p")`
  position: relative;
  display: inline-block;

  &::before, &::after {
    content: '';
    position: absolute;
    width: 75px;
    height: 1px;
    background-color: black;
    top: 50%;
    transform: translateY(-50%);
  }

  &::before {
    left: -85px;
  }

  &::after {
    right: -85px;
  }
`;

const Checkout = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const [order, setOrder] = useState<Order | Record<string, never> | null>({});
  const [showSuccessPage, setShowSuccessPage] = useState(false);

  // 取得訂單資料
  useEffect(() => {
    if (!id) {
      return;
    }
    (async () => {
      try {
        dispatch(setIsFullPageLoading(true));
        const res = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/order/${id}`);
        setOrder(res.data.order);
      } catch (err) {
        if (err instanceof AxiosError) {
          console.log(err?.response?.data.message);
          if (err?.response?.status === 404) {
            setOrder({});
          }
        }
      } finally {
        dispatch(setIsFullPageLoading(false));
      }
    })()
  }, [dispatch, id]);

  // 折扣金額計算
  const discount = useMemo(() => {
    if (!order?.products) {
      return;
    }
    return Object.values(order?.products)?.reduce((acc, cur) => acc + (cur.total * 100 - cur.final_total * 100), 0) / 100
  }, [order]);

  // 取得優惠券資訊
  const coupon = useMemo(() => {
    if (!order?.products || !Object.values(order?.products)?.[0]?.coupon) {
      return;
    }
    return Object.values(order?.products)?.[0]?.coupon;
  }, [order]);

  // 送出結帳
  const handleCheckout = async () => {
    try {
      dispatch(setIsFullPageLoading(true));
      await axios.post(`${VITE_API_BASE}/api/${VITE_API_PATH}/pay/${id}`);
      setShowSuccessPage(true);
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err?.response?.data.message);
      }
    } finally {
      dispatch(setIsFullPageLoading(false));
    }
  }

  // 轉換時間戳記
  const formatDateFromTimestamp = (date: number) => {
    return new Date(date * 1000).toISOString().split('T')[0];
  }

  return (
    <>
      {
        !showSuccessPage
          ? <div className="container my-5">
              <div className="d-flex align-items-center pb-3 mb-4">
                <h3 className="title fs-2 mb-0 me-3">Checkout</h3>
                <small className="mt-2">訂｜單｜結｜帳</small>
              </div>
              {
                !order
                  ? <div className="text-center">
                      <h6 className="text-dark">查無此訂單</h6>
                      <NavLink to="/cart" className="btn btn-secondary rounded-pill px-5 mt-4 position-relative">
                        回到購物車
                        <span className="btn-arrow ms-3 position-absolute">→</span>
                      </NavLink>
                    </div>
                  : <>
                      <div className="row">
                        <div className="mb-4 d-flex align-items-center">
                          <span className="badge rounded-pill bg-primary me-3">訂單成立時間</span>
                          <p className="mb-0 me-4">{order.create_at && formatDateFromTimestamp(order?.create_at)}</p>
                          <span className="badge rounded-pill bg-primary me-3">付款狀態</span>
                          <p className={`mb-0 me-4 ${order.is_paid ? 'text-success' : 'text-danger'}`}>{order.is_paid ? '已付款' : '待付款'}</p>
                          {
                            order.is_paid
                              ? <>
                                  <span className="badge rounded-pill bg-primary me-3">付款時間</span>
                                  <p className="mb-0 me-4">{order.paid_date && formatDateFromTimestamp(order.paid_date)}</p>
                                </>
                              : ''
                          }
                        </div>
                        <div className="col-md-6 mb-4">
                          <span className="badge rounded-pill bg-primary mb-1">訂購資訊</span>
                          <small className="d-flex py-1 my-1 border-bottom border-top">
                            <span className="flex-shrink-0 me-4">訂購大名</span>
                            <span className="ms-auto">{order.user?.name}</span>
                          </small>
                          <small className="d-flex py-1 my-1 border-bottom">
                            <span className="flex-shrink-0 me-4">聯絡電話</span>
                            <span className="ms-auto">{order.user?.tel}</span>
                          </small>
                          <small className="d-flex py-1 my-1 border-bottom">
                            <span className="flex-shrink-0 me-4">收件地址</span>
                            <span className="ms-auto">{order.user?.address}</span>
                          </small>
                          <small className="d-flex py-1 my-1 border-bottom">
                            <span className="flex-shrink-0 me-4">電子郵件</span>
                            <span className="ms-auto">{order.user?.email}</span>
                          </small>
                          <small className="d-flex py-1 my-1 border-bottom">
                            <span className="flex-shrink-0 me-4">訂單備註</span>
                            <span className="ms-auto">{order.message}</span>
                          </small>
                        </div>
                        <div className="col-md-6 mb-4">
                          <span className="badge rounded-pill bg-primary mb-1">商品明細</span>
                          {
                            order?.products && Object.values(order?.products)?.map((item, index) => {
                              return (
                                <small className={`d-flex py-1 my-1 border-bottom ${index === 0 && 'border-top'}`} key={`${id}-${item.id}`}>
                                  <span className="flex-shrink-0 me-4">{item.product.title} * {item.qty}</span>
                                  <span className="ms-auto">${item.total}</span>
                                </small>
                              )
                            })
                          }
                          <small className="d-flex pb-1 mb-1 border-bottom">
                            <span className="flex-shrink-0 me-4">優惠券折扣{ coupon ? `（${coupon.title} ${coupon.percent} 折）`: '' }</span>
                            { coupon ? <span className="ms-auto text-danger">-${discount}</span> : '' }
                          </small>
                          <small className="fw-bold d-flex pb-1 mb-1 border-bottom">
                            <span className="flex-shrink-0 me-4">總金額</span>
                            <span className="ms-auto">${order.total}</span>
                          </small>
                        </div>
                      </div>
                      {
                        !order.is_paid
                          ? <div className="text-center"><Button btnStyle="btn btn-secondary px-5 mt-5" handleClick={handleCheckout}>確認結帳</Button></div>
                          : ''
                      }
                    </>
              }
            </div>
          : <div className="container text-center py-5 my-5">
              <img src="./plant.svg" alt="plant-icon" className="mb-4" style={{ width: '70px' }} />
              <h3 className="title text-info fst-italic mb-3" style={{ fontSize: '64px' }}>Thank You!</h3>
              <Message>已收到您的訂單，我們將儘速為您處理</Message>
            </div>
      }
    </>
  )
}

export default Checkout;
