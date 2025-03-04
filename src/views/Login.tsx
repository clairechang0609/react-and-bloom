import axios, { AxiosError } from 'axios';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { setIsFullPageLoading } from '../slice/loadingSlice';
import { asyncSetMessage } from '../slice/toastSlice';
import { useAppDispatch } from '../store';
const { VITE_API_BASE } = import.meta.env;

// 登入表單
const Login = () => {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();

  // 處理輸入資料
  const handleInput = useCallback((e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setForm((pre) => ({
      ...pre,
      [name]: value
    }))
  }, []);

  // 登入
  const login = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      dispatch(setIsFullPageLoading(true));
      const res = await axios.post(`${VITE_API_BASE}/admin/signin`, form);
      const { token, expired } = res.data;
      document.cookie = `andBloom=${token}; expires=${new Date(expired)};`;
      setTimeout(() => {
        navigate('/admin/products');
      }, 500);
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err?.response?.data.message);
        dispatch(asyncSetMessage({ text: err?.response?.data.message, type: 'danger' }));
      }
    } finally {
      dispatch(setIsFullPageLoading(false));
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
    </>
  )
};

export default Login;
