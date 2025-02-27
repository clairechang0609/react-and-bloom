import { useEffect, useRef } from 'react';
import { Outlet } from 'react-router';
import { createGlobalStyle } from 'styled-components';
import Footer from '../components/frontend/Footer';
import Navbar from '../components/frontend/Navbar';

const Global = createGlobalStyle`
  body {
    padding-top: 70px;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .root {
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 70px);
    padding-bottom: 73px;
  }
`;

const FrontendLayout = () => {
  const navbarRef = useRef<HTMLDivElement | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      console.log('scrolling');

      if (window.scrollY > lastScrollY.current) {
        navbarRef.current?.classList.add('hidden');
      } else {
        navbarRef.current?.classList.remove('hidden');
      }

      lastScrollY.current = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <Global />
      <Navbar ref={navbarRef} />
      <Outlet />
      <Footer />
    </>
  );
};

export default FrontendLayout;
