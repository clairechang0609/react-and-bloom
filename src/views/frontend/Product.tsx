import { useParams, useNavigate } from 'react-router';
import axios, { AxiosError } from 'axios';
import 'bootstrap';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../store';
import { asyncSetMessage } from '../../slice/toastSlice';
import '../../assets/home.scss';
import FullPageLoading from '../../components/FullPageLoading';
import type { Product } from '../../types/product';
import Button from '../../components/Button';
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState<number>(1);
  const [isFullPageLoading, setIsFullPageLoading] = useState<boolean>(false);

  // 取得產品資料
  useEffect(() => {
    if (!id) {
      navigate('/products');
    }
    (async () => {
      try {
        setIsFullPageLoading(true);
        const res = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/product/${id}`);
        setProduct(res.data.product);
      } catch (err) {
        if (err instanceof AxiosError) {
          console.log(err?.response?.data.message);
          if (err?.response?.status === 404) {
            dispatch(asyncSetMessage({ text: err?.response?.data.message, type: 'danger' }));
            navigate('*');
          }
        }
      } finally {
        setIsFullPageLoading(false);
      }
    })()
  }, [dispatch, id, navigate]);

  // 加入購物車
  const addCart = async(productId?: string) => {
    try {
      setIsFullPageLoading(true);
      const res = await axios.post(`${VITE_API_BASE}/api/${VITE_API_PATH}/cart`, {
        data: {
          product_id: productId,
          qty
        }
      });
      dispatch(asyncSetMessage({ text: res?.data.message, type: 'success' }));
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err?.response?.data.message);
      }
    } finally {
      setIsFullPageLoading(false);
    }
  };

  const toPositiveInteger = (value: string) => {
    const result = value.replace(/[^0-9]+/g, '');
    return result && parseInt(result) ? parseInt(result) : 1;
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-5 col-lg-4 mb-3 mb-lg-0">
          <div className="carousel slide" id="carousel">
            <div className="carousel-inner">
              <div className="carousel-item active bg-black">
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
            <Button type="submit" btnStyle="btn btn-secondary flex-shrink-0 ms-3" handleClick={() => { addCart(product?.id) }}>加入購物車</Button>
          </div>
        </div>
      </div>

      {isFullPageLoading && <FullPageLoading />}
    </div>
  );
};

export default Product;
