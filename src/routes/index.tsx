import { createHashRouter, redirect } from 'react-router';
import AdminLayout from '../layout/AdminLayout';
import FrontendLayout from '../layout/FrontendLayout';
import Orders from '../views/admin/Orders';
import AdminProducts from '../views/admin/Products';
import Cart from '../views/frontend/Cart';
import Home from '../views/frontend/Home';
import Product from '../views/frontend/Product';
import Products from '../views/frontend/Products';
import Login from '../views/Login';
import NotFound from '../views/NotFound';

const routes = createHashRouter([
  {
    path: '/',
    element: <FrontendLayout />,
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: 'products',
        element: <Products />
      },
      {
        path: 'product/:id',
        element: <Product />
      },
      {
        path: 'cart',
        element: <Cart />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        loader: async () => redirect('/admin/products')
      },
      {
        path: 'products',
        element: <AdminProducts />
      },
      {
        path: 'orders',
        element: <Orders />
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

export default routes;
