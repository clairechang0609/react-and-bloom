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
import Coupons from '../views/admin/Coupons';
import Checkout from '../views/frontend/Checkout';
import Articles from '../views/frontend/Articles';
import Article from '../views/frontend/Article';
import AdminArticles from '../views/admin/Articles';

const routes = createHashRouter([
  {
    path: '',
    element: <Home />
  },
  {
    path: '/',
    element: <FrontendLayout />,
    children: [
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
      },
      {
        path: 'checkout/:id',
        element: <Checkout />
      },
      {
        path: 'articles',
        element: <Articles />
      },
      {
        path: 'article/:id',
        element: <Article />
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
      },
      {
        path: 'coupons',
        element: <Coupons />
      },
      {
        path: 'articles',
        element: <AdminArticles />
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

export default routes;
