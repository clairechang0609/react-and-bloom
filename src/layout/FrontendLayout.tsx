import { Outlet } from 'react-router';
import Footer from '../components/frontend/Footer';
import Navbar from '../components/frontend/Navbar';

const FrontendLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default FrontendLayout;
