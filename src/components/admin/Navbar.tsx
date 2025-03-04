import axios, { AxiosError } from 'axios';
import { useCallback, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router';
import styled from 'styled-components';
import { setIsFullPageLoading } from '../../slice/loadingSlice';
import { asyncSetMessage } from '../../slice/toastSlice';
import { useAppDispatch } from '../../store';
import type { ModalRef } from '../../types/modal';
import AlertModal from '../AlertModal';
const { VITE_API_BASE } = import.meta.env;

const Nav = styled("nav")`
  height: 70px;
  box-shadow: 0 1px 5px rgba(0,0,0,0.1);
  background-color: rgba(255,255,255,0.5);

  @supports (animation-timeline: scroll()) {
    background-color: rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
  }
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
  const dispatch = useAppDispatch();
  const alertModalRef = useRef<ModalRef | null>(null);
  const navigate = useNavigate();

  // 顯示 Alert Modal
  const showAlertModal = useCallback(() => {
    alertModalRef.current?.show();
  }, []);

  const logout = async() => {
    try {
      dispatch(setIsFullPageLoading(true));
      await axios.post(`${VITE_API_BASE}/logout`);
      alertModalRef.current?.hide();
      navigate('/login');
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
      <Nav className="fixed-top py-3 px-5 d-flex align-items-center">
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
          <NavLink to="/admin/coupons" className="px-4">
            <Link>優惠券管理</Link>
          </NavLink>
          <i className="bi bi-box-arrow-right fs-4 cursor-pointer px-4" onClick={showAlertModal} />
        </div>
      </Nav>

      <AlertModal ref={alertModalRef} nextFn={logout}>
        <p className="text-center py-4">您確定登出系統嗎？</p>
      </AlertModal>
    </>
  )
};

export default Navbar;
