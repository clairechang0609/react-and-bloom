import axios, { AxiosError } from 'axios';
import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import FullPageLoading from '../components/FullPageLoading';
import AlertToast from '../components/Toast';
import { ToastRef, ToastType } from '../types/toast';
const { VITE_API_BASE } = import.meta.env;

// 登入表單
const Login = () => {
  const [isFullPageLoading, setIsFullPageLoading] = useState<boolean>(false);
  const [form, setForm] = useState({
    username: '',
    password: ''
  });
  const toastRef = useRef<ToastRef | null>(null);
  const navigate = useNavigate();

  // 處理輸入資料
  const handleInput = useCallback((e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setForm((pre) => ({
      ...pre,
      [name]: value
    }))
  }, []);

  // 顯示提示訊息
  const showToast = (text: string, type: ToastType) => {
    toastRef.current?.show(text, type);
  };

  // 登入
  const login = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      setIsFullPageLoading(true);
      const res = await axios.post(`${VITE_API_BASE}/admin/signin`, form);
      const { token, expired } = res.data;
      document.cookie = `andBloom=${token}; expires=${new Date(expired)};`;
      navigate('/admin/products');
      setIsFullPageLoading(false);
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err?.response?.data.message);
        showToast(err?.response?.data.message, 'danger')
      }
    } finally {
      setIsFullPageLoading(false);
    }
  };

  return (
    <>
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
      <AlertToast ref={toastRef} />
      {isFullPageLoading && <FullPageLoading />}
    </>
  )
};

export default Login;
