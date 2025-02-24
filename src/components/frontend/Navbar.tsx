import { useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router';
import styled from 'styled-components';
import { asyncGetCart, cartData } from '../../slice/cartSlice';
import { useAppDispatch } from '../../store';

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

const Navbar = () => {
  const dispatch = useAppDispatch();
  const header = useRef<HTMLDivElement | null>(null);
  const { cart } = useSelector(cartData);
  const qty = useMemo(() => cart.reduce((acc, cur) => acc + cur.qty, 0), [cart]);

  useEffect(() => {
    dispatch(asyncGetCart({ isShowLoading: false }));
  }, [dispatch]);

  useEffect(() => {
    // if (header.current) {
    //   new LocomotiveScroll({
    //     el: header.current,
    //     smooth: true,
    //     lerp: .06,
    //     multiplier: .5
    //   });
    // }
  }, []);

  return (
    <Nav ref={header} className="fixed-top py-3 px-5 d-flex align-items-center">
      <NavLink to="/" className="d-flex align-items-center px-4">
        <Heading>&<em>Bloom</em></Heading>
      </NavLink>
      <div className="d-flex align-items-center ms-auto">
        <NavLink to="/products" className="px-4">
          <Link>PLANTS・所有植栽</Link>
        </NavLink>
        <NavLink to="/cart" className="px-4">
          <Link className="position-relative">
            CART・購物車
            {
              qty
                ? (<span className="position-absolute top-25 start-100 translate-middle badge rounded-pill bg-success ms-1">
                  {qty}
                  <span className="visually-hidden">unread messages</span>
                </span>)
                : ''
            }
          </Link>
        </NavLink>
        <NavLink to="/admin" className="btn btn-sm btn-outline-primary rounded-pill px-4 mx-4 py-1">
          後台
        </NavLink>
      </div>
    </Nav>
  )
};

export default Navbar;
