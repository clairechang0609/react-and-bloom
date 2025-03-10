import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import AlertModal from '../../components/AlertModal';
import Button from "../../components/Button";
import Pagination from '../../components/Pagination';
import CouponListItem from "../../components/admin/CouponListItem";
import CouponModal from "../../components/admin/CouponModal";
import { setIsFullPageLoading } from "../../slice/loadingSlice";
import { asyncSetMessage } from "../../slice/toastSlice";
import { useAppDispatch } from "../../store";
import { CouponItem } from "../../types/coupon";
import { ModalRef } from "../../types/modal";
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const Coupon = () => {
  const dispatch = useAppDispatch();
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [TotalPages, setTotalPages] = useState(1);
  const [selectedCoupon, setSelectedCoupon] = useState<CouponItem | null>(null);
  const modalRef = useRef<ModalRef | null>(null);
  const alertModalRef = useRef<ModalRef | null>(null);

  // 取得列表
  const getCoupons = useCallback(async () => {
    try {
      dispatch(setIsFullPageLoading(true));
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)andBloom\s*=\s*([^;]*).*$)|^.*$/,"$1",);
      axios.defaults.headers.common.Authorization = token;
      const res = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/admin/coupons?page=${currentPage}`);
      setCoupons(res.data.coupons);
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
    getCoupons();
  }, [getCoupons]);

  // 顯示 Modal
  const showModal = useCallback(() => {
    modalRef.current?.show();
  }, []);

  // 顯示 Alert Modal
  const showAlertModal = useCallback(() => {
    alertModalRef.current?.show();
  }, []);

  // 新增
  const addCoupon = useCallback(() => {
    setSelectedCoupon(null);
    showModal();
  }, [showModal]);

  // 刪除
  const deleteCoupon = useCallback(async (id: string) => {
    if (!id) return;

    try {
      dispatch(setIsFullPageLoading(true));
      const res = await axios.delete(`${VITE_API_BASE}/api/${VITE_API_PATH}/admin/coupon/${id}`);
      dispatch(asyncSetMessage({ text: res?.data.message, type: 'success' }));
      getCoupons();
      alertModalRef.current?.hide();
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err?.response?.data.message);
        dispatch(asyncSetMessage({ text: err?.response?.data.message, type: 'danger' }));
      }
    } finally {
      dispatch(setIsFullPageLoading(false));
      setSelectedCoupon(null);
    }
  }, [dispatch, getCoupons]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom">
        <h3 className="mb-0">優惠券列表</h3>
        <Button btnStyle="btn-sm btn-secondary" handleClick={addCoupon}>新增</Button>
      </div>
      {
        coupons.length
        ? <>
            {coupons.map((item) => (
              <CouponListItem showModal={showModal} setSelectedCoupon={setSelectedCoupon} showAlertModal={showAlertModal}
                coupon={item} key={item.id} />
            ))}
            <div className="d-flex justify-content-center my-5">
              <Pagination currentPage={currentPage} totalPages={TotalPages} setCurrentPage={setCurrentPage} />
            </div>
          </>
        : <p className="text-center">尚無優惠券</p>
      }

      <CouponModal
        ref={modalRef}
        selectedCoupon={selectedCoupon}
        getCoupons={getCoupons}
      />

      <AlertModal ref={alertModalRef} nextFn={() => deleteCoupon(selectedCoupon?.id || '')}>
        <p className="text-center py-4">刪除後無法復原，您確定刪除<strong>{selectedCoupon?.title}</strong>嗎？</p>
      </AlertModal>
    </>
  )
};

export default Coupon;
