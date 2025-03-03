import axios, { AxiosError } from 'axios';
import 'bootstrap';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { createGlobalStyle } from 'styled-components';
import Button from '../../components/Button';
import ProductCard from '../../components/frontend/ProductCard';
import useGetProducts from '../../hooks/frontend/useGetProducts';
import { asyncAddCart } from '../../slice/cartSlice';
import { setIsFullPageLoading } from '../../slice/loadingSlice';
import { useAppDispatch } from '../../store';
import type { Product } from '../../types/product';
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

import { Swiper as SwiperClass } from 'swiper/types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';

const Global = createGlobalStyle`
  .main-swiper-side {
    aspect-ratio: 3 / 4;
    position: relative;
  }

  .main-swiper-side::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 75%, rgba(0, 0, 0, 0.05) 85%, rgba(0, 0, 0, 0.1));
    pointer-events: none;
  }

  .swiper-slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .swiper-navigation {
    z-index: 1000;
  }

  .thumb .swiper-slide {
    width: 25%;
    aspect-ratio: 1 / 1;
    opacity: 0.5;
    cursor: pointer;
  }

  .thumb .swiper-slide-thumb-active {
    opacity: 1;
  }
`;

const Product = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState<number>(1);
  const { products, getProducts } = useGetProducts({ category: product?.category, immediate: false });
  const filterProducts = useMemo(() => {
    return products?.filter((item: Product) => item.id !== product?.id).slice(0, 2);
  }, [product?.id, products]);

  // 取得產品資料
  useEffect(() => {
    if (!id) {
      navigate('/products');
    }
    (async () => {
      try {
        dispatch(setIsFullPageLoading(true));
        const res = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/product/${id}`);
        setProduct(res.data.product);
        await getProducts();
      } catch (err) {
        if (err instanceof AxiosError) {
          console.log(err?.response?.data.message);
          if (err?.response?.status === 404) {
            navigate('*');
          }
        }
      } finally {
        dispatch(setIsFullPageLoading(false));
      }
    })()
  }, [dispatch, getProducts, id, navigate]);

  const toPositiveInteger = (value: string) => {
    const result = value.replace(/[^0-9]+/g, '');
    return result && parseInt(result) ? parseInt(result) : 1;
  }

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [mainSwiper, setMainSwiper] = useState<SwiperClass | null>(null);

  const swiperConfig = {
    spaceBetween: '10px',
    loop: true,
    modules: [ FreeMode, Navigation, Thumbs ]
  };

  const thumbSwiperConfig = {
    slidesPerView: 4,
    spaceBetween: '10px',
    freeMode: true,
    watchSlidesProgress: true,
    modules: [ FreeMode, Navigation, Thumbs ],
    className: 'thumb'
  };

  return (
    <>
      <Global />
      <div className="container my-5">
        <div className="row">
          <div className="col-md-5 col-lg-4 mb-3 mb-lg-0">
            {
              products.length
                ? <>
                  <Swiper onSwiper={setMainSwiper} thumbs={{ swiper: thumbsSwiper }} {...swiperConfig} className="position-relative bg-background mb-2">
                    <SwiperSlide className="main-swiper-side">
                      <img src={product?.imageUrl} className="w-100 object-fit-cover mask-img" alt="主圖" />
                    </SwiperSlide>
                    {product?.imagesUrl.map((item, index) => {
                      return <SwiperSlide className="main-swiper-side" key={`swiper-slide-${index}`}>
                        <img src={item} alt="附圖" className="d-block w-100 object-fit-cover mask-img" />
                      </SwiperSlide>
                    })}
                    <div className="swiper-navigation position-absolute bottom-0 start-0 d-flex justify-content-between w-100 px-2">
                      <i className="bi bi-arrow-left fs-1 text-white cursor-pointer" onClick={() => mainSwiper?.slidePrev()} />
                      <i className="bi bi-arrow-right fs-1 text-white cursor-pointer" onClick={() => mainSwiper?.slideNext()} />
                    </div>
                  </Swiper>
                  <Swiper onSwiper={setThumbsSwiper} {...thumbSwiperConfig}>
                    <SwiperSlide>
                      <img src={product?.imageUrl} className="w-100 object-fit-cover mask-img" alt="主圖" />
                    </SwiperSlide>
                    {product?.imagesUrl.map((item, index) => {
                      return <SwiperSlide key={`thumb-swiper-slide-${index}`}>
                        <img src={item} alt="附圖" className="d-block w-100 object-fit-cover mask-img" />
                      </SwiperSlide>
                    })}
                  </Swiper>
                </>
                : ''
            }
          </div>
          <div className="col-md-7 col-lg-8 d-flex flex-column">
            <span className="badge rounded-pill bg-primary mb-3 align-self-start">{product?.category}</span>
            <h2 className="fs-3 fw-light border-bottom pb-3 mb-4">{product?.title}</h2>
            <div className="card-text mb-3">
              <h6 className="fw-bold d-block">商品描述：</h6>
              <p>{product?.description}</p>
            </div>
            <div className="card-text mb-3">
              <h6 className="fw-bold d-block">注意事項：</h6>
              <p>{product?.content}</p>
            </div>
            <div className="mb-4">
              <div className="text-muted d-flex align-items-center mb-2">
                <h6 className="text-decoration-line-through mb-0">$ {product?.origin_price}</h6>
              </div>
              <div className="d-flex align-items-center">
                <h4 className="mb-0 text-danger">$ {product?.price}</h4>
                <span className="badge rounded-pill text-bg-danger ms-2">sale</span>
              </div>
            </div>
            <div className="d-flex align-items-center mt-auto">
              <i className={`bi bi-dash-square-fill fs-3 ${qty === 1 ? 'cursor-default opacity-50' : 'cursor-pointer'}`} onClick={() => qty > 1 && setQty(qty - 1)} />
              <input type="number" className="form-control w-auto mx-2" value={qty} onChange={(e) => setQty(toPositiveInteger(e.target.value))} />
              <i className="bi bi-plus-square-fill fs-3 cursor-pointer" onClick={() => setQty(qty + 1)} />
              <Button type="submit" btnStyle="btn btn-secondary flex-shrink-0 ms-3" handleClick={() => { dispatch(asyncAddCart({ productId: product?.id, qty })) }}>加入購物車</Button>
            </div>
          </div>
          {
            filterProducts.length
              ? <div className="mt-5">
                  <div className="border-top p-5">
                    <div className="d-flex flex-column align-items-center text-center">
                      <h5 className="title text-center fs-2 mb-3">＼ Recommendations ／</h5>
                      <p className="d-block">精選商品</p>
                    </div>
                    <div className="row row-cols-1 row-cols-md-2 gx-lg-5 my-5">
                      {
                        filterProducts.map(item => {
                          return <ProductCard item={item} isLink={true} key={item.id} />
                        })
                      }
                    </div>
                  </div>
                </div>
              : ''
          }
        </div>
      </div>
    </>
  );
};

export default Product;
