import axios, { AxiosError } from 'axios';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import Navbar from '../components/admin/Navbar';
const { VITE_API_BASE } = import.meta.env;

const AdminLayout = () => {
  const navigate = useNavigate();

  // 檢查登入是否過期
  useEffect(() => {
    (async () => {
      try {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)andBloom\s*=\s*([^;]*).*$)|^.*$/,"$1",);
        axios.defaults.headers.common.Authorization = token;
        await axios.post(`${VITE_API_BASE}/api/user/check`);
      } catch (err) {
        if (err instanceof AxiosError) {
          console.log(err?.response?.data.message);
        }
        navigate('/login');
      }
    })();
  }, [navigate]);

  return (
    <div>
      <Navbar />
      <div className="container container-admin my-5">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
