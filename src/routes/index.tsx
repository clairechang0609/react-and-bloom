import { createHashRouter } from 'react-router';
import Layout from '../Layout';
import Home from '../views/Home';
import Checkout from '../views/Checkout';

const routes = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: 'checkout',
        element: <Checkout />
      }
    ]
  }
]);

export default routes;
