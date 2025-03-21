import axios, { AxiosError } from 'axios';
import 'bootstrap';
import { useCallback, useEffect, useRef, useState } from 'react';
import ProductListItem from '../../components/admin/ProductListItem';
import ProductModal from '../../components/admin/ProductModal';
import AlertModal from '../../components/AlertModal';
import Button from '../../components/Button';
import Pagination from '../../components/Pagination';
import { setIsFullPageLoading } from '../../slice/loadingSlice';
import { asyncSetMessage } from '../../slice/toastSlice';
import { useAppDispatch } from '../../store';
import type { ModalRef } from '../../types/modal';
import type { Product } from '../../types/product';
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const AdminProducts = () => {
  const dispatch = useAppDispatch();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [TotalPages, setTotalPages] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const modalRef = useRef<ModalRef | null>(null);
  const alertModalRef = useRef<ModalRef | null>(null);

  // 取得產品資料
  const getProducts = useCallback(async () => {
    try {
      dispatch(setIsFullPageLoading(true));
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)andBloom\s*=\s*([^;]*).*$)|^.*$/,"$1",);
      axios.defaults.headers.common.Authorization = token;
      const res = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/admin/products?page=${currentPage}`);
      setProducts(res.data.products);
      setTotalPages(res.data.pagination?.total_pages);
      setCurrentPage(res.data.pagination?.current_page);
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err?.response?.data.message);
      }
    } finally {
      dispatch(setIsFullPageLoading(false));
    }
  }, [currentPage, dispatch]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  // 顯示 Modal
  const showModal = useCallback(() => {
    modalRef.current?.show();
  }, []);

  // 顯示 Alert Modal
  const showAlertModal = useCallback(() => {
    alertModalRef.current?.show();
  }, []);

  // 新增產品
  const addProduct = useCallback(() => {
    setSelectedProduct(null);
    showModal();
  }, [showModal]);

  // 刪除商品
  const deleteProduct = useCallback(async (id: string) => {
    if (!id) return;

    try {
      dispatch(setIsFullPageLoading(true));
      const res = await axios.delete(`${VITE_API_BASE}/api/${VITE_API_PATH}/admin/product/${id}`);
      dispatch(asyncSetMessage({ text: res?.data.message, type: 'success' }));
      getProducts();
      alertModalRef.current?.hide();
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err?.response?.data.message);
        dispatch(asyncSetMessage({ text: err?.response?.data.message, type: 'danger' }));
      }
    } finally {
      dispatch(setIsFullPageLoading(false));
      setSelectedProduct(null);
    }
  }, [dispatch, getProducts]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom">
        <h3 className="mb-0">產品列表</h3>
        <Button btnStyle="btn-sm btn-secondary" handleClick={addProduct}>新增</Button>
      </div>
      {
        products.length
        ? <>
            {products.map((item) => (
              <ProductListItem showModal={showModal} setSelectedProduct={setSelectedProduct} showAlertModal={showAlertModal}
                product={item} key={item.id} />
            ))}
            <div className="d-flex justify-content-center my-5">
              <Pagination currentPage={currentPage} totalPages={TotalPages} setCurrentPage={setCurrentPage} />
            </div>
          </>
        : <p className="text-center">尚無產品，請新增產品</p>
      }

      <ProductModal
        ref={modalRef}
        selectedProduct={selectedProduct}
        getProducts={getProducts}
      />

      <AlertModal ref={alertModalRef} nextFn={() => deleteProduct(selectedProduct?.id || '')}>
        <p className="text-center py-4">刪除後無法復原，您確定刪除<strong>{selectedProduct?.title}</strong>嗎？</p>
      </AlertModal>
    </>
  )
}

export default AdminProducts;
