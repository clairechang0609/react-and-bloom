import 'bootstrap';
import "bootstrap-icons/font/bootstrap-icons.css";
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import 'swiper/css';
import App from './App.tsx';
import './assets/app.scss';
import { store } from './store';
import 'ckeditor5/ckeditor5.css';

createRoot(document.getElementById('root')!).render(
  <>
    <Provider store={store}>
      <App />
    </Provider>
  </>
)
