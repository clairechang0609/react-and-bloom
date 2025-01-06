import { useState, useRef, useEffect, SetStateAction, Dispatch, FC, ChangeEvent } from 'react';
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

const setToken = () => {
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)andBloom\s*=\s*([^;]*).*$)|^.*$/,"$1",);
  axios.defaults.headers.common.Authorization = token;
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

const UploadImageInput = () => {
  const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const formData = new FormData();
    if (!file) {
      return;
    }
    formData.append('file-to-upload', file);
    try {
      setToken();
      const res = await axios.post(`${VITE_API_BASE}/api/${VITE_API_PATH}/admin/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('文件上傳成功:', res.data);
    } catch (err) {
      console.error('文件上傳失敗:', err);
    }
  }

  return (
    <input type="file" name="file-to-upload" className="mb-5" onChange={uploadImage} />
  )
}

const App = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [tempProduct, setTempProduct] = useState<Product | null>(null);

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
              {/* <UploadImageInput /> */}
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


// const initProducts = [
//   {
//     "category": "觀葉植物",
//     "content": "適合的生長溫度為 15℃～25℃。最低需要保持在 10℃以上",
//     "description": "以獨特的葉片切割與孔洞著稱，為室內增添熱帶風情。適合擺放在明亮但避免直射陽光的地方，耐陰易養，是美觀又實用的觀葉植物。",
//     "is_enabled": 1,
//     "origin_price": 2250,
//     "price": 1980,
//     "title": "龜背芋（Monstera deliciosa）",
//     "unit": "盆",
//     "num": 10,
//     "imageUrl": "https://storage.googleapis.com/vue-course-api.appspot.com/and-bloom/1736172725495.jpg?GoogleAccessId=firebase-adminsdk-zzty7%40vue-course-api.iam.gserviceaccount.com&Expires=1742169600&Signature=aev3BkYNLr354F%2Ft484%2FVMWnIijv3vC%2BLGyAGfwRzupRfruZfNIJ22SCzpn4A4VauTGSCJxNJWRhfILc7QWjKb%2BmGMfN3piOvTgUxKMmcw%2BRXtvAhYpwkjz0wox6Dk%2FDYD9FoljB7a%2Fa2WjXBDAEvzycZudpcReO5raNh6qrFHQehi1M2ulCBF8RIAo2qFBK9IgTqYBvoavXGOh5XYE9uA%2F2MUWDyJlFTVU7xtuYy6wT2I1onPd%2FKe1Xpu2FSaA9qpxS5uE2pGF4NrVSeWtBSx%2BDnzbq%2Fy52Dxpe7jQEwS6T%2BDmLToIwkCK%2B3csjINKfUi%2FSAwDCjxAZX0oNwptQ%2Fg%3D%3D",
//     "imagesUrl": [
//       "https://storage.googleapis.com/vue-course-api.appspot.com/and-bloom/1736172618155.jpg?GoogleAccessId=firebase-adminsdk-zzty7%40vue-course-api.iam.gserviceaccount.com&Expires=1742169600&Signature=eP2oZUS0kieKIM91zgKNIVPMG%2BuGQMLvy0sVbN8Ix7Np7srw064C8siLsyM803RC272xAVFwjOn%2Fe7RjrfqAcnml9Q%2BL2OaLPCP7zp9TdhAQr6G1k8PvbeoDRG5hJNCSK5D%2FS8tJDRsvhXDNH%2BwbjkIh2zcnou87NLDxZQJxj%2BVjbhUz1jRcdRbNSm5MRxAvKUdK8j0co8ybid16wDeOGYc7NT%2BOnH9Wq7ZCAWb5q7x5j9hMzdjre8m5oG%2B4OObYtIgo3vX%2FoazyIfQG4BLtYWfjMef6DMnrQ1iWJxNb%2BV2IxCHMRGbON9xFYGnSY4RxN40550AgBVzfwRMzAxKbKw%3D%3D",
//       "https://storage.googleapis.com/vue-course-api.appspot.com/and-bloom/1736173378716.jpg?GoogleAccessId=firebase-adminsdk-zzty7%40vue-course-api.iam.gserviceaccount.com&Expires=1742169600&Signature=B9ejy%2B%2Fh7B%2FTyXxh3CBRyuVoIAAgBbrNieH%2FyUgwsk0DZAWgWph4OfiOO0sRmtq4ypk1SV7T6cKMoQRC9udjFVjuw6GI0%2FAj3ERGJ8wKWKbSGfgLUNC11br3ZPm97pcc6MrjTP7kq4lXXj5gUV%2FUATWdNTlfZwB7PeegUr8yr%2BhaI8uRD74Tv0h6vHnWPnI2Y8mswGaoxbxjPg3F%2FnrYrQJdr8JwanDV3sTcPVPH9ExaIjeuFEv0KvuZyCT69ZxFXBPv%2B%2FHBZEPfywZwbruBRNE3baWj6b5ZpKQNmVZIgzsKe6BOputBbcF%2BBd2cpPk%2Bz99RawwN9IVal1M4eFs88w%3D%3D",
//       "https://storage.googleapis.com/vue-course-api.appspot.com/and-bloom/1736172796275.jpg?GoogleAccessId=firebase-adminsdk-zzty7%40vue-course-api.iam.gserviceaccount.com&Expires=1742169600&Signature=iNUw8T0ziOp%2FcZzWs7pg8uCF9gk91QxhG4R8klhy0MOu9hVBVCO8vh32RM%2FNFil7mzWbqXv27HZguFnjnZuHAt%2BPqF1USzlDio5yxXEh239MdNLghWbwX%2BpgsSU9agbC0gBIBrQgSDvDbFuFzEmAl3tezP85IeVD6e4B%2Fpa5bx8J6W%2BNNmdzqE3uG9VIufwX%2FQ5BGeZ5Hr1b1%2F6V3gehriKRyPM4fHzDStBuKqs1IHip8Ga64JVQdSt274C6naHR1z4NMR9bGPHMee5yCC9ycrDGCliYm7rh0E3bsGaJvA%2BpI1nZWQKwGkyukCV5T%2Be%2BahWno5I12b9F2m7l2TqCDQ%3D%3D"
//     ]
//   },
//   {
//     "category": "觀葉植物",
//     "content": "適合的生長溫度為 15℃～25℃。最低需要保持在 10℃以上",
//     "description": "因其鮮豔的花苞和獨特的葉片形狀，在室內植物中深受喜愛。常被用於美化空間或作為禮品花卉。",
//     "is_enabled": 1,
//     "origin_price": 2250,
//     "price": 2080,
//     "title": "火鶴花（Anthurium）",
//     "unit": "盆",
//     "num": 10,
//     "imageUrl": "https://storage.googleapis.com/vue-course-api.appspot.com/and-bloom/1736174617147.jpg?GoogleAccessId=firebase-adminsdk-zzty7%40vue-course-api.iam.gserviceaccount.com&Expires=1742169600&Signature=nKOvLDc5lj7yuWa%2B4m4dsaLZ7UkWPGnkC0ibxnshzs2Rw%2BZLhdCOsViQw4kXza0SyJoOigUfsSxdh2TLSHbvOhXDw6Xo9YLrZyraaPh3Qnd20JboLsmyaREKZPqQor3uVfnXAqPnxRbVaxd0Lrtx5YoWH69GRLycofOyy99CYkIG72J41DsqubdfqMR6QYGu8BpzKxG1WXs3wHyULc1%2FmlYZkPUnS%2B8KLoe80l91HNyg1AJ9PK4pK8JUqYU%2B1Mn5lB79GXaVlnVro8V5RNdTlKZq6VX8bYwBG8%2B2w5cgk6MUVddLgJMiQF4w4K9zocgDNKgXwT%2BojmX8wHpEFQoBxA%3D%3D",
//     "imagesUrl": [
//       "https://storage.googleapis.com/vue-course-api.appspot.com/and-bloom/1736174623818.jpg?GoogleAccessId=firebase-adminsdk-zzty7%40vue-course-api.iam.gserviceaccount.com&Expires=1742169600&Signature=K5T%2BwymTsXXUAWei%2BvVKgKUxJOgEloo%2F4x3BXJ5fmDyM%2BiuuCLHu%2F3GZNcScMsrOG9Rr3K2xE23NM7lwseGGlha%2Ba8zoVUV289rAoKbcKyeRkGi%2FDLksflhEr3TuBRvbdYEC%2B0SUJfmiCgWnHSmPpUa75v6VA%2By9ctdlRClZqTsREDJ3KwfNuygWcdOrXI4B7zBzNKpgR%2FV9ghgsHgY6Z1H3y5j8ihD04aIhN0I%2BlO8UpeawUv2WPe%2BdqqgArBJPKuq502b1hRHtJ14olBUFGpqZPzv7d%2FZGGItuiNDZaaBQFjbcTq0O7WYS0j0S3o1bOc8GndMf%2BfgBpl51WMT43A%3D%3D",
//       "https://storage.googleapis.com/vue-course-api.appspot.com/and-bloom/1736174626412.jpg?GoogleAccessId=firebase-adminsdk-zzty7%40vue-course-api.iam.gserviceaccount.com&Expires=1742169600&Signature=RzDA2PPM6UfrznGyHSSFuC1QGduwL4jvF4qIy1XLzROv7rIIi9GBc6nDBoTmAhIE9PvZIiI17f2srYhKo7MfRbpVIopsOVQBqtGFmYYy%2BS7bHxUC7mNeKwqNm6aXDavV7pP8FP2AG1FWqs%2BqV%2FrBLndTP6lU3zIMvZoAjRwRbiUQIOLQGqiqRKGVUS68Lm7sYxIjAoln0sA8f0Eyb%2FMb2Cg%2F2bA%2F00FNhIVnhUMQP1xOYqQKY5CUKEHI6Qesq9I3Nbq3ZpQb70KWcXTLYbGGucswXyMm0OuAeuGp95Jb2PIf1PDND3dIEMGdi%2Bqvbn6mD1em9ExGIQ3XF%2FZb8d%2BSDg%3D%3D",
//       "https://storage.googleapis.com/vue-course-api.appspot.com/and-bloom/1736174629646.jpg?GoogleAccessId=firebase-adminsdk-zzty7%40vue-course-api.iam.gserviceaccount.com&Expires=1742169600&Signature=C6tVkBxAvcFTkVs6TP1zmVwEIleGemUjRB%2BvMjK5uXVyrIZPx67DUSEOXIUCpoNnY2nl7v7aYsMrLaAHzwDLjvFvmdhO4pqIm5E9KY0%2F7x7UnitDghxT4AlQ2BBzqCe40%2FGykj17F%2F%2B5Y0rZITJoFgO32%2FptNJziDYRbjfPdtG1ndjlV%2F4mGSjhKuqRYLXxOSSFbsS0q0XJE0lbTt2wFC%2BPtPL9DBxtagJtSLw85LwT9yX6WK%2B5FEObX6Rw51jb%2BggtNbf3SPwM3Hy%2BggLtLcL1%2F2k1iGjO2NRzAImAl9R1HJGQzRyQBA275fWSSSNJsI4kabRB36q7Qb%2BPpq%2FlLtg%3D%3D"
//     ]
//   }
// ];