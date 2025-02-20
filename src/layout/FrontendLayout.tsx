import { useEffect } from 'react';
import { Outlet } from 'react-router';
import Footer from '../components/frontend/Footer';
import Navbar from '../components/frontend/Navbar';
import { asyncGetCart } from '../slice/cartSlice';
import { useAppDispatch } from '../store';

const FrontendLayout = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(asyncGetCart());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default FrontendLayout;
