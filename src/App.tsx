import { useState, useRef, useEffect, SetStateAction, Dispatch, FC } from 'react';
import './assets/app.css';
import axios from 'axios';

const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

interface LoginFormProps {
  setIsLogin: Dispatch<SetStateAction<boolean>>;
}

// 登入表單
const LoginForm: FC<LoginFormProps> = ({ setIsLogin }) => {
  const [form, setForm] = useState({
    username: '',
    password: ''
  });

  const handleInput = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setForm((pre) => ({
      ...pre,
      [name]: value
    }))
  }

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
    <form id="form" className="form" onSubmit={login}>
      <input type="email" name="username" id="username" onChange={handleInput} />
      <input type="password" name="password" id="password" onChange={handleInput} />
      <button type="submit" className="btn btn-primary">Login</button>
    </form>
  )
}

const App = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false);

  // 檢查登入是否過期
  useEffect(() => {
    (async () => {
      try {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)andBloom\s*=\s*([^;]*).*$)|^.*$/,"$1",);
        axios.defaults.headers.common.Authorization = token;
        await axios.post(`${VITE_API_BASE}/api/user/check`);
        setIsLogin(true);
      } catch (err) {
        setIsLogin(false);
      }
    })();
  })

  return (
    <>
      {
        isLogin
          ? '已登入'
          : <LoginForm setIsLogin={setIsLogin} />
      }
    </>
  )
}

export default App;
