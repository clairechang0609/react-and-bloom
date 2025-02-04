import { useState, FC, memo, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import type { LoginFormProps } from '../types/login';
const { VITE_API_BASE } = import.meta.env;


// 登入表單
const LoginForm: FC<LoginFormProps> = memo(({ setIsLogin, showToast, setIsFullPageLoading }) => {
  const [form, setForm] = useState({
    username: '',
    password: ''
  });

  // 處理輸入資料
  const handleInput = useCallback((e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setForm((pre) => ({
      ...pre,
      [name]: value
    }))
  }, []);

  // 登入
  const login = useCallback(async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      setIsFullPageLoading(true);
      const res = await axios.post(`${VITE_API_BASE}/admin/signin`, form);
      const { token, expired } = res.data;
      document.cookie = `andBloom=${token}; expires=${new Date(expired)};`;
      setIsLogin(true);
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err?.response?.data.message);
        showToast(err?.response?.data.message, 'danger')
      }
      setIsLogin(false);
    } finally {
      setIsFullPageLoading(false);
    }
  }, [form, setIsFullPageLoading, setIsLogin, showToast])

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
});

export default LoginForm;
