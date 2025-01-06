import { useState, useRef, useEffect, SetStateAction, Dispatch, FC } from 'react';
import axios from 'axios';
import './assets/home.scss';

const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

interface LoginFormProps {
  setIsLogin: Dispatch<SetStateAction<boolean>>;
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

// 登入表單
const LoginForm: FC<LoginFormProps> = ({ setIsLogin }) => {
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
      console.log((err as Error).message);
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
    <li className="list-group-item d-flex justify-content-between" onClick={() => setTempProduct(product)}>
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
                商品描述：<br />
                {tempProduct.description}
              </p>
              <p className="card-text">{tempProduct.content}</p>
              <div className="d-flex align-items-center">
                <h5 className="mb-0 me-2 text-danger">$ {tempProduct.price}</h5>
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

const App = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [tempProduct, setTempProduct] = useState<Product | null>(null);

  const setToken = () => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)andBloom\s*=\s*([^;]*).*$)|^.*$/,"$1",);
    axios.defaults.headers.common.Authorization = token;
  }

  // 檢查登入是否過期
  useEffect(() => {
    (async () => {
      try {
        setToken();
        await axios.post(`${VITE_API_BASE}/api/user/check`);
        setIsLogin(true);
      } catch (err) {
        console.log(err);
        setIsLogin(false);
      }
    })();
  })

  // 取得商品列表
  useEffect(() => {
    if (isLogin) {
      (async () => {
        try {
          setToken();
          const res = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/admin/products`);
          setProducts(res.data.products);

          // TODO: 刪除
          // 初始產品列表
          const initProducts: Product[] = [
            {
              category: "甜甜圈",
              content: "尺寸：14x14cm",
              description: "濃郁的草莓風味，中心填入滑順不膩口的卡士達內餡，帶來滿滿幸福感！",
              id: "-L9tH8jxVb2Ka_DYPwng",
              is_enabled: 1,
              origin_price: 150,
              price: 99,
              title: "草莓莓果夾心圈",
              unit: "元",
              num: 10,
              imageUrl: "https://images.unsplash.com/photo-1583182332473-b31ba08929c8",
              imagesUrl: [
                "https://images.unsplash.com/photo-1626094309830-abbb0c99da4a",
                "https://images.unsplash.com/photo-1559656914-a30970c1affd"
              ]
            },
            {
              category: "蛋糕",
              content: "尺寸：6寸",
              description: "蜜蜂蜜蛋糕，夾層夾上酸酸甜甜的檸檬餡，清爽可口的滋味讓人口水直流！",
              id: "-McJ-VvcwfN1_Ye_NtVA",
              is_enabled: 1,
              origin_price: 1000,
              price: 900,
              title: "蜂蜜檸檬蛋糕",
              unit: "個",
              num: 1,
              imageUrl: "https://images.unsplash.com/photo-1627834377411-8da5f4f09de8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1001&q=80",
              imagesUrl: [
                "https://images.unsplash.com/photo-1618888007540-2bdead974bbb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=987&q=80",
              ]
            },
            {
              category: "蛋糕",
              content: "尺寸：6寸",
              description: "法式煎薄餅加上濃郁可可醬，呈現經典的美味及口感。",
              id: "-McJ-VyqaFlLzUMmpPpm",
              is_enabled: 0,
              origin_price: 700,
              price: 600,
              title: "暗黑千層",
              unit: "個",
              num: 15,
              imageUrl: "https://images.unsplash.com/photo-1505253149613-112d21d9f6a9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDZ8fGNha2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60",
              imagesUrl: [
                "https://images.unsplash.com/flagged/photo-1557234985-425e10c9d7f1?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTA5fHxjYWtlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60",
                "https://images.unsplash.com/photo-1540337706094-da10342c93d8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDR8fGNha2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60"
              ]
            }
          ];
          setProducts(initProducts);

        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [isLogin]);

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
          : <LoginForm setIsLogin={setIsLogin} />
      }
    </>
  )
}

export default App;
