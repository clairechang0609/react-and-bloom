import { forwardRef, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router';
import styled from 'styled-components';
import { asyncGetCart, cartData } from '../../slice/cartSlice';
import { useAppDispatch } from '../../store';

const Nav = styled("nav")`
  height: 70px;
  box-shadow: 0 1px 5px rgba(0,0,0,0.1);
  background-color: rgba(255,255,255,0.5);
  transform: translateY(0);
  transition: 0.5s cubic-bezier(.77,0,.18,1) 0.15s;

  @supports (animation-timeline: scroll()) {
    background-color: rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
  }

  &.hidden:not(.active) {
    transform: translateY(-100%);
  }

  &.active {
    background-color: var(--background);
    backdrop-filter: none;
    box-shadow: none;
  }
`;

const Link = styled("span")`
  position: relative;
  padding-top: 1rem;
  padding-bottom: 1rem;
  font-size: 0.875rem;

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

const Hamberger = styled('div')`
  position: relative;
  width: 25px;
  height: 17px;
  transform: scale(0.8);
  .line {
    position: absolute;
    width: 100%;
    height: 2px;
    border-radius: 1px;
    background-color: black;
    transition: opacity .3s, width .3s ease, top .3s ease, transform .3s .2s ease;
    &:nth-child(1) {
      top: 0;
    }
    &:nth-child(2) {
      top: 50%;
    }
    &:nth-child(3) {
      top: 100%;
      width: 50%;
    }
  }
  &:hover {
    .line {
      &:nth-child(2) {
        width: 50%;
      }
      &:nth-child(3) {
        width: 100%;
      }
    }
  }
  &.active {
    .line {
      &:nth-child(1) {
        top: 50%;
        transform: rotate(-135deg);
        transform-origin: center;
      }
      &:nth-child(2) {
        opacity: 0;
      }
      &:nth-child(3) {
        top: 50%;
        transform: rotate(135deg);
        transform-origin: center;
        width: 100%;
      }
    }
  }
`;

const Menu = styled('div')`
  position: fixed;
  top: 70px;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: var(--background);
  transform: translateY(100%);
  transition: transform 0.5s cubic-bezier(.77,0,.18,1) 0.15s;
  trasition-origin: bottom;
  z-index: 990;

  a {
    transform: translateY(-200%);
    opacity: 0;
    transition: 0.6s cubic-bezier(.77,0,.18,1) 0.3s;
  }

  &.active {
    transform: translateY(0);

    a {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;


const MenuItems = () => {
  const { cart } = useSelector(cartData);
  const qty = useMemo(() => cart.reduce((acc, cur) => acc + cur.qty, 0), [cart]);

  return (
    <>
      <NavLink to="/products" className="my-5 my-lg-0 px-4">
        <Link>PLANTS・所有植栽</Link>
      </NavLink>
      <NavLink to="/cart" className="my-5 my-lg-0 px-4">
        <Link className="position-relative">
          CART・購物車
          {
            qty
              ? (<span className="position-absolute top-25 start-100 translate-middle badge rounded-pill text-bg-success ms-1">
                {qty}
                <span className="visually-hidden">unread messages</span>
              </span>)
              : ''
          }
        </Link>
      </NavLink>
      <NavLink to="/admin" className="btn btn-sm btn-outline-primary rounded-pill px-4 mx-4 py-1 my-5 my-lg-0 ">
        後台
      </NavLink>
    </>
  )
}

const Navbar = forwardRef<HTMLDivElement>((_props, ref) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    dispatch(asyncGetCart({ isShowLoading: false }));
  }, [dispatch]);

  const toggleMenu = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    setIsActive(false);
  }, [location]);

  return (
    <>
      <Nav ref={ref} className={`py-3 px-4 px-xl-5 fixed-top d-flex align-items-center ${isActive ? 'active' : ''}`}>
        <NavLink to="/" className="d-flex align-items-center px-lg-4">
          <Heading>&<em>Bloom</em></Heading>
        </NavLink>
        <div className="d-none d-lg-flex align-items-center ms-auto">
          <MenuItems />
        </div>
        <Hamberger onClick={toggleMenu} className={`ms-auto cursor-pointer d-lg-none ${isActive ? 'active' : ''}`}>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </Hamberger>
      </Nav>
      <Menu className={`d-lg-none d-flex flex-column align-items-center ${isActive ? 'active' : ''}`}>
        <MenuItems />
      </Menu>
    </>
  )
});

export default Navbar;
