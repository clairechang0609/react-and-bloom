import { useState, useRef, useEffect, SetStateAction, Dispatch, FC, ChangeEvent, MutableRefObject } from 'react';
import axios, { AxiosError } from 'axios';
import './assets/home.scss';
import { Toast } from 'bootstrap';

const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

interface LoginFormProps {
  toast: MutableRefObject<Toast | null>;
  setIsLogin: Dispatch<SetStateAction<boolean | null>>;
  setToastText: Dispatch<SetStateAction<string>>;
}
interface Product {
  id: string;
  category: string;
  content: string;
  origin_price: number;
  price: number;
  description: string;
  is_enabled: 0 | 1;
  title: string;
  unit: string;
  num: number;
  imageUrl: string;
  imagesUrl: string[];
}
interface ProductListItemProps {
  product: Product;
  setTempProduct: Dispatch<SetStateAction<Product | null>>;
}

interface ToastProps {
  toastRef: MutableRefObject<HTMLDivElement | null>;
  toastText: string;
}

// 設定 Authorization
const setAuthorization = () => {
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)andBloom\s*=\s*([^;]*).*$)|^.*$/,"$1",);
  axios.defaults.headers.common.Authorization = token;
}

// 登入表單
const LoginForm: FC<LoginFormProps> = ({ toast, setIsLogin, setToastText }) => {
  const [form, setForm] = useState({
    username: '',
    password: ''
  });

  // 處理輸入資料
  const handleInput = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setForm((pre) => ({
      ...pre,
      [name]: value
    }))
  }

  // 登入
  const login = async (e: { preventDefault: () => void }) => {
    try {
      e.preventDefault();
      const res = await axios.post(`${VITE_API_BASE}/admin/signin`, form);
      const { token, expired } = res.data;
      document.cookie = `andBloom=${token}; expires=${new Date(expired)};`;
      setIsLogin(true);
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err?.response?.data.message);
        setToastText(err?.response?.data.message);
        toast.current?.show();
      }
      setIsLogin(false);
    }
  }

  return (
    <div className="position-fixed top-0 bottom-0 start-0 end-0 d-flex align-items-center justify-content-center">
      <form id="form" className="form" onSubmit={login}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Email</label>
          <input type="email" name="username" className="form-control" id="username" placeholder="email" onChange={handleInput} />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" name="password" className="form-control" id="password" placeholder="password" onChange={handleInput} />
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  )
}

// 狀態圖示
const StatusIcon: FC<{isEnabled: 0|1}> = ({ isEnabled }) => {
  const status = isEnabled
    ? { icon: 'bi-check', label: '啟用', class: 'text-bg-success' }
    : { icon: 'bi-x', label: '停用', class: 'text-bg-danger' };

  return (
    <div className={`badge rounded-pill ${status.class}`}>
      <i className={`bi ${status.icon}`}></i> {status.label}
    </div>
  );
};

// 產品項目
const ProductListItem: FC<ProductListItemProps> = ({ product, setTempProduct }) => {
  const { title, price, origin_price, is_enabled } = product;
  return (
    <li className="product-list-item card mb-2" onClick={() => setTempProduct(product)}>
      <div className="card-body d-flex justify-content-between">
        <div>
          <h6 className="mt-1 mb-2">{title}</h6>
          <div className="d-flex align-items-center">
            <p className="mb-0 me-2">$ {price}</p>
            <small className="text-muted text-decoration-line-through">$ {origin_price}</small>
          </div>
        </div>
        <div>
          <StatusIcon isEnabled={is_enabled} />
        </div>
      </div>
    </li>
  )
}

// 產品介紹卡片
const TempProductCard: FC<{ tempProduct: Product | null }> = ({ tempProduct }) => {
  return <>
    {tempProduct ? (
      <div className="card mb-3">
        <div className="card-body">
          <div className="row">
            <div className="col-lg-5 mb-3 mb-lg-0">
              <div className="carousel slide" id="carousel">
                <div className="carousel-inner">
                  <div className="carousel-item active bg-black">
                    <img src={tempProduct.imageUrl} className="w-100 object-fit-cover mask-img" alt="主圖" />
                  </div>
                  {tempProduct.imagesUrl.map((item, index) => {
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
            <div className="col-lg-7">
              <span className="badge rounded-pill bg-primary fs-sm mb-2">{tempProduct.category}</span>
              <h5 className="border-bottom pb-2 mb-3">{tempProduct.title}</h5>
              <p className="card-text">
                <small className="fw-bold d-block">商品描述：</small>
                {tempProduct.description}
              </p>
              <p className="card-text">
              <small className="fw-bold d-block">注意事項：</small>
                {tempProduct.content}
              </p>
              <div className="d-flex align-items-center">
                <h4 className="mb-0 me-2 text-danger">$ {tempProduct.price}</h4>
                <small className="text-muted text-decoration-line-through">$ {tempProduct.origin_price}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <p>點擊商品查看介紹</p>
    )}
  </>
}

// toast 元件
const ToastComponent: FC<ToastProps> = ({ toastRef, toastText }) => {
  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3">
      <div id="toast" className="toast text-bg-danger" role="alert" aria-live="assertive" aria-atomic="true" ref={toastRef}>
        <div className="toast-body d-flex">
          {toastText}
          <button type="button" className="btn-close ms-auto flex-shrink-0" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    </div>
  )
}

const App = () => {
  const [isLogin, setIsLogin] = useState<boolean | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [tempProduct, setTempProduct] = useState<Product | null>(null);
  const toastRef = useRef<HTMLDivElement | null>(null);
  const toast = useRef<Toast | null>(null);
  const [toastText, setToastText] = useState<string>('');

  // 檢查登入是否過期
  useEffect(() => {
    (async () => {
      try {
        setAuthorization();
        await axios.post(`${VITE_API_BASE}/api/user/check`);
        setIsLogin(true);
      } catch (err) {
        if (err instanceof AxiosError) {
          console.log(err?.response?.data.message);
          setToastText(err?.response?.data.message);
          toast.current?.show();
        }
        setIsLogin(false);
      }
    })();
  }, []);

  // 取得商品列表
  useEffect(() => {
    if (isLogin) {
      (async () => {
        try {
          setAuthorization();
          const res = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/admin/products`);
          setProducts(res.data.products);
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [isLogin]);

  // toast
  useEffect(() => {
    if (toastRef.current) {
      toast.current = new Toast(toastRef.current);
    }
  }, []);

  return (
    <>
      {
        isLogin
          ? <div className="container mt-5 mb-5">
              <h3 className="pb-3 mb-3 border-bottom">產品列表</h3>
              <div className="row gx-3 gx-lg-4 mt-5">
                <div className="col-md-4 mb-3 mb-md-0">
                  <ul className="list-group">
                    {products.map((item) => (
                      <ProductListItem product={item} setTempProduct={setTempProduct} key={item.id} />
                    ))}
                  </ul>
                </div>
                <div className="col-md-8">
                  <TempProductCard tempProduct={tempProduct} />
                </div>
              </div>
            </div>
          : isLogin !== null && <LoginForm setIsLogin={setIsLogin} toast={toast} setToastText={setToastText} />
      }

      <ToastComponent toastRef={toastRef} toastText={toastText} />
    </>
  )
}

export default App;