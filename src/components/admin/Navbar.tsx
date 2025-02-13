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

const Heading = styled("h1")`
  font-family: 'Cormorant Garamond', Didot, 'Bodoni MT', 'Noto Serif Display', 'URW Palladio L', P052, Sylfaen, serif;
  color: black;
  font-size: 32px;
  margin: 0;
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
      alertModalRef.current?.hide();
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
        <NavLink to="/admin" className="d-flex align-items-center px-4">
          <Heading>&<em>Bloom</em></Heading>
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
