import axios, { AxiosError } from 'axios';
import 'bootstrap';
import { Modal } from 'bootstrap';
import { useEffect, useRef, useState } from 'react';
import '../../assets/home.scss';
import ProductListItem from '../../components/frontend/ProductListItem';
import ProductModal from '../../components/frontend/ProductModal';
import FullPageLoading from '../../components/FullPageLoading';
import Pagination from '../../components/Pagination';
import AlertToast from '../../components/Toast';
import type { Product } from '../../types/product';
import type { ToastRef } from '../../types/toast';
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [TotalPages, setTotalPages] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFullPageLoading, setIsFullPageLoading] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const modal = useRef<Modal | null>(null);
  const alertModalRef = useRef<HTMLDivElement | null>(null);
  const alertModal = useRef<Modal | null>(null);
  const toastRef = useRef<ToastRef | null>(null);

  // Modal 實體
  useEffect(() => {
    if (modalRef.current) {
      modal.current = new Modal(modalRef.current);
    }
    if (alertModalRef.current) {
      alertModal.current = new Modal(alertModalRef.current);
    }
  }, []);

  // 取得產品資料
  useEffect(() => {
    (async () => {
      try {
        setIsFullPageLoading(true);
        const res = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/products?page=${currentPage}`);
        setProducts(res.data.products);
        setTotalPages(res.data.pagination?.total_pages);
        setCurrentPage(res.data.pagination?.current_page);
      } catch (err) {
        if (err instanceof AxiosError) {
          console.log(err?.response?.data.message);
        }
      } finally {
        setIsFullPageLoading(false);
      }
    })()
  }, [currentPage]);

  // 加入購物車
  const addCart = async(productId?: string) => {
    try {
      setIsFullPageLoading(true);
      await axios.post(`${VITE_API_BASE}/api/${VITE_API_PATH}/cart`, {
        data: {
          product_id: productId,
          qty: 1
        }
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err?.response?.data.message);
      }
    } finally {
      setIsFullPageLoading(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom">
        <h4 className="mb-0">產品列表</h4>
      </div>
      {products.map((item) => (
        <ProductListItem modal={modal} setSelectedProduct={setSelectedProduct} product={item} key={item.id}
          addCart={addCart} />
      ))}
      <div className="d-flex justify-content-center my-5">
        <Pagination currentPage={currentPage} totalPages={TotalPages} setCurrentPage={setCurrentPage} />
      </div>

      <ProductModal
        modalRef={modalRef}
        modal={modal}
        selectedProduct={selectedProduct}
        addCart={addCart}
      />

      <AlertToast ref={toastRef} />

      {isFullPageLoading && <FullPageLoading />}
    </>
  )
}

export default Products;
