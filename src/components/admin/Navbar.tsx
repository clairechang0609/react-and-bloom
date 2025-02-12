import axios, { AxiosError } from 'axios';
import { useCallback, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import styled from 'styled-components';
import AlertToast from '../../components/Toast';
import type { ModalRef } from '../../types/modal';
import type { ToastRef, ToastType } from '../../types/toast';
import AlertModal from '../AlertModal';
import FullPageLoading from '../FullPageLoading';
const { VITE_API_BASE } = import.meta.env;

const Nav = styled("nav")`
  height: 70px;
  backdrop-filter: blur(10px);
  box-shadow: 0 1px 5px rgba(0,0,0,0.1);
`;

const Link = styled("span")`
  position: relative;
  padding-top: 1rem;
  padding-bottom: 1rem;

  &::before {
    content: '';
    height: 1px;
    width: 0;
    background-color: black;
    position: absolute;
    bottom: 10px;
    transition: width 0.3s ease-in-out;
  }

  &:hover::before {
    width: 100%;
  }
`;

const Navbar = () => {
  const alertModalRef = useRef<ModalRef | null>(null);
  const toastRef = useRef<ToastRef | null>(null);
  const [isFullPageLoading, setIsFullPageLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // 顯示 Alert Modal
  const showAlertModal = useCallback(() => {
    alertModalRef.current?.show();
  }, [])

  // 顯示提示訊息
  const showToast = useCallback((text: string, type: ToastType) => {
    toastRef.current?.show(text, type);
  }, []);

  const logout = async() => {
    try {
      setIsFullPageLoading(true);
      await axios.post(`${VITE_API_BASE}/logout`);
      navigate('/login');
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err?.response?.data.message);
        showToast(err?.response?.data.message, 'danger');
      }
    } finally {
      setIsFullPageLoading(false);
    }
  };

  return (
    <>
      <Nav className="fixed-top py-3 px-5 d-flex align-items-center bg-white bg-opacity-10">
        <NavLink to="/admin" className="px-4">
          <svg xmlns="http://www.w3.org/2000/svg" id="_圖層_1" data-name="圖層 1" viewBox="0 0 595.28 595.28" width="70px">
            <path className="cls-2" fill="#231815" d="M445.26,636.15c-15.78-8.22-36.03-28.98-60.75-62.28s-40.52-61.28-47.38-83.94c-3.44-10.3-6.17-16.12-8.23-17.5-4.81-4.81-25.75,3.77-62.81,25.73-13.73,7.56-26.44,11.33-38.11,11.33-14.42,0-23.69-1.36-27.8-4.11-4.12-2.75-9.27-11.33-15.45-25.75-6.19-16.47-8.92-27.11-8.23-31.92,3.44-15.78,16.48-42.91,39.14-81.36l17.5-30.89c0-2.06,3.42-8.58,10.3-19.56,6.86-10.98,10.3-18.88,10.3-23.69,0-5.48-5.16-18.88-15.45-40.16-21.97-48.73-32.61-79.62-31.92-92.69,0-8.23,2.22-17.5,6.69-27.8s8.77-16.47,12.89-18.53c23.33-10.98,41.86-18.88,55.59-23.69,13.73-2.75,21.28-4.12,22.66-4.12,2.75,0,11.67,1.72,26.78,5.16,13.03,3.44,21.09,6.17,24.19,8.23s6.7,7.91,10.83,17.5c3.42,12.38,5.14,21.64,5.14,27.81,0,4.81-4.12,18.7-12.36,41.7-8.25,23-14.08,37.25-17.5,42.73-2.06,2.06-4.47,7.91-7.2,17.5-2.06,6.88-6.88,17.17-14.42,30.91-8.25,10.98-12.36,17.16-12.36,18.53,0,2.06,4.8,9.97,14.42,23.69,10.97,14.42,17.84,26.78,20.59,37.06,5.48,15.11,12.69,20.27,21.62,15.45,10.28-5.48,15.44-20.59,15.44-45.31,0-15.78,3.77-31.92,11.33-48.41,2.75-6.86,6.86-10.3,12.36-10.3,4.12,0,8.23,3.09,12.36,9.28s6.19,13.39,6.19,21.62l2.05,32.95c.69,3.44,1.03,9.61,1.03,18.53,0,10.3-1.72,19.22-5.16,26.77-3.44,7.56-9.61,16.83-18.53,27.81-13.05,15.11-19.56,25.06-19.56,29.86,0,3.44,7.72,19.75,23.17,48.92,15.44,29.19,26.25,47.55,32.44,55.08,8.23,10.31,15.44,20.95,21.62,31.94,4.8,7.55,14.75,20.25,29.86,38.09,9.61,8.94,15.11,16.48,16.48,22.66v2.06c0,3.44-2.75,6.17-8.23,8.23-5.5,1.38-10.31,2.06-14.42,2.06l-12.36-1.03c-10.3-1.38-18.53-3.44-24.72-6.19Zm-215.22-169.91c2.75,0,8.23-1.7,16.48-5.14,11.66-7.55,21.27-12.7,28.83-15.45,8.92-4.11,16.47-9.59,22.66-16.47,4.8-4.81,7.2-8.92,7.2-12.36l-3.08-9.28c-3.44-8.91-5.16-15.44-5.16-19.56,0-6.17-2.23-14.23-6.7-24.19s-8.41-14.94-11.83-14.94-6.19,3.09-8.25,9.27c-2.75,6.88-7.2,14.77-13.38,23.69-25.41,33.64-38.11,57.67-38.11,72.08,0,5.5,2.06,9.27,6.19,11.33,.69,.69,2.39,1.03,5.14,1.03Zm82.91-276.48c14.06-31.23,21.11-50.62,21.11-58.19,0-4.12-2.06-7.55-6.19-10.3-4.12-2.06-10.98-3.09-20.59-3.09-13.05,0-23,1.03-29.86,3.09-6.88,2.06-14.42,6.88-22.66,14.42-8.94,8.23-13.39,16.81-13.39,25.73,0,5.5,2.06,11.33,6.19,17.52l14.41,23.67c12.36,22.66,20.59,33.98,24.72,33.98,3.44,0,12.19-15.61,26.27-46.84Z"/>
          </svg>
        </NavLink>
        <div className="d-flex align-items-center ms-auto">
          <NavLink to="/" className="btn btn-outline-primary rounded-pill px-4 mx-4 py-1">
            前台
          </NavLink>
          <NavLink to="/admin/products" className="px-4">
            <Link>產品管理</Link>
          </NavLink>
          <NavLink to="/admin/orders" className="px-4">
            <Link>訂單管理</Link>
          </NavLink>
          <i className="bi bi-box-arrow-right fs-4 cursor-pointer px-4" onClick={showAlertModal} />
        </div>
      </Nav>

      <AlertModal ref={alertModalRef} nextFn={logout}>
        <p className="text-center py-4">您確定登出系統嗎？</p>
      </AlertModal>

      <AlertToast ref={toastRef} />

      {isFullPageLoading && <FullPageLoading />}
    </>
  )
};

export default Navbar;
