import axios, { AxiosError } from 'axios';
import 'bootstrap';
import { useCallback, useEffect, useRef, useState } from 'react';
import '../../assets/home.scss';
import OrderListItem from '../../components/admin/OrderListItem';
import OrderModal from '../../components/admin/OrderModal';
import AlertModal from '../../components/AlertModal';
import Pagination from '../../components/Pagination';
import { setIsFullPageLoading } from '../../slice/loadingSlice';
import { asyncSetMessage } from '../../slice/toastSlice';
import { useAppDispatch } from '../../store';
import type { ModalRef } from '../../types/modal';
import type { Order } from '../../types/order';

const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const Orders = () => {
  const dispatch = useAppDispatch();
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [TotalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const modalRef = useRef<ModalRef | null>(null);
  const alertModalRef = useRef<ModalRef | null>(null);

  // 取得產品資料
  const getOrders = useCallback(async () => {
    try {
      dispatch(setIsFullPageLoading(true));
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)andBloom\s*=\s*([^;]*).*$)|^.*$/,"$1",);
      axios.defaults.headers.common.Authorization = token;
      const res = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/admin/orders?page=${currentPage}`);
      setOrders(res.data.orders);
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

  // 取得訂單列表
  useEffect(() => {
    getOrders();
  }, [getOrders]);

  // 顯示 Modal
  const showModal = useCallback(() => {
    modalRef.current?.show();
  }, []);

  // 顯示 Alert Modal
  const showAlertModal = useCallback(() => {
    alertModalRef.current?.show();
  }, []);

  // 刪除訂單
  const deleteOrder = useCallback(async (id: string) => {
    if (!id) return;

    try {
      dispatch(setIsFullPageLoading(true));
      const res = await axios.delete(`${VITE_API_BASE}/api/${VITE_API_PATH}/admin/order/${id}`);
      dispatch(asyncSetMessage({ text: res?.data.message, type: 'success' }));
      getOrders();
      setSelectedOrder(null);
      alertModalRef.current?.hide();
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err?.response?.data.message);
        dispatch(asyncSetMessage({ text: err?.response?.data.message, type: 'danger' }));
        setSelectedOrder(null);
      }
    } finally {
      dispatch(setIsFullPageLoading(false));
    }
  }, [dispatch, getOrders]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom">
        <h3 className="mb-0">訂單列表</h3>
      </div>
      {
        orders.length
        ? <>
            {orders.map((item) => (
              <OrderListItem showModal={showModal} setSelectedOrder={setSelectedOrder} showAlertModal={showAlertModal}
                order={item} key={item.id} />
            ))}
            <div className="d-flex justify-content-center my-5">
              <Pagination currentPage={currentPage} totalPages={TotalPages} setCurrentPage={setCurrentPage} />
            </div>
          </>
        : <p className="text-center">尚無訂單</p>
      }

      <OrderModal
        ref={modalRef}
        selectedOrder={selectedOrder}
        getOrders={getOrders}
      />

      <AlertModal ref={alertModalRef} nextFn={() => deleteOrder(selectedOrder?.id || '')}>
        <p className="text-center py-4">刪除後無法復原，您確定刪除該筆訂單嗎？</p>
      </AlertModal>
    </>
  )
}

export default Orders;
