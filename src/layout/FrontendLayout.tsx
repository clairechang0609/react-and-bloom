import { Outlet } from 'react-router';
import Navbar from '../components/frontend/Navbar';

const FrontendLayout = () => {
  return (
    <div>
      <Navbar />
      <div className="container my-5">
        <Outlet />
      </div>
    </div>
  );
};

export default FrontendLayout;
