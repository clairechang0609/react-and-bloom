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
  return (
    <>
      <Global />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default FrontendLayout;
