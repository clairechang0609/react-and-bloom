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

const Global = createGlobalStyle`
  .carousel-item {
    aspect-ratio: 3 / 4;
  }
  .carousel-control-prev-icon {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='white'%3e%3cpath d='M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8'/%3e%3c/svg%3e") !important;
  }
  .carousel-control-next-icon {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='white'%3e%3cpath d='M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8'/%3e%3c/svg%3e") !important;
  }
  .mask-img {
    mask: linear-gradient(0deg, rgba(0, 0, 0, 0.75), black 50%);
  }
`;

const Product = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState<number>(1);
  const { products } = useGetProducts({ category: product?.category });
  const filterProducts = useMemo(() => {
    return products?.filter((item: Product) => item.id !== product?.id).slice(0, 2);
  }, [product?.id, products])

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
  }, [dispatch, id, navigate]);

  const toPositiveInteger = (value: string) => {
    const result = value.replace(/[^0-9]+/g, '');
    return result && parseInt(result) ? parseInt(result) : 1;
  }

  return (
    <>
      <Global />
      <div className="container my-5">
        <div className="row">
          <div className="col-md-5 col-lg-4 mb-3 mb-lg-0">
            <div className="carousel slide" id="carousel">
              <div className="carousel-inner">
                <div className="carousel-item active bg-light">
                  <img src={product?.imageUrl} className="w-100 object-fit-cover mask-img" alt="主圖" />
                </div>
                {product?.imagesUrl.map((item, index) => {
                  return <div className="carousel-item bg-black" key={index}>
                    <img src={item} alt="附圖" className="d-block w-100 object-fit-cover mask-img" />
                  </div>
                })}
              </div>
              <button className="carousel-control-prev align-items-end pb-2" type="button" data-bs-target="#carousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next align-items-end pb-2" type="button" data-bs-target="#carousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
          <div className="col-md-7 col-lg-8 d-flex flex-column">
            <span className="badge rounded-pill bg-primary mb-3 align-self-start">{product?.category}</span>
            <h2 className="fs-4 border-bottom pb-3 mb-4">{product?.title}</h2>
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
                <span className="badge rounded-pill text-bg-light me-2">原價</span>
                <h6 className="text-decoration-line-through mb-0 me-2">$ {product?.origin_price}</h6>
              </div>
              <div className="d-flex align-items-center">
                <span className="badge rounded-pill text-bg-danger me-2">特價</span>
                <h4 className="mb-0 me-2 text-danger">$ {product?.price}</h4>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <i className={`bi bi-dash-square-fill fs-3 ${qty === 1 ? 'cursor-default opacity-50' : 'cursor-pointer'}`} onClick={() => qty > 1 && setQty(qty - 1)} />
              <input type="number" className="form-control w-auto mx-2" value={qty} onChange={(e) => setQty(toPositiveInteger(e.target.value))} />
              <i className="bi bi-plus-square-fill fs-3 cursor-pointer" onClick={() => setQty(qty + 1)} />
              <Button type="submit" btnStyle="btn btn-secondary flex-shrink-0 ms-3" handleClick={() => { dispatch(asyncAddCart({ productId: product?.id, qty })) }}>加入購物車</Button>
            </div>
          </div>
          {
            filterProducts.length
              ? <div className="mt-5">
                  <div className="border-top text-center p-5">
                    <h5 className="title fs-2">＼ Recommendations ／</h5>
                    <div className="row row-cols-1 row-cols-md-2 gx-lg-5 my-5">
                      {
                        filterProducts.map(item => {
                          return <ProductCard item={item} key={item.id} />
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
