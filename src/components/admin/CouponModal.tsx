import axios, { AxiosError } from 'axios';
import { Modal } from 'bootstrap';
import { ChangeEvent, forwardRef, memo, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { FieldValues, useForm, useWatch } from 'react-hook-form';
import { setIsFullPageLoading } from '../../slice/loadingSlice';
import { asyncSetMessage } from '../../slice/toastSlice';
import { useAppDispatch } from '../../store';
import type { ModalRef } from '../../types/modal';
import Button from '../Button';
import Field from '../form/Field';
import FormInput from '../form/FormInput';
import { AdminCouponModalProps } from '../../types/coupon';
import { formatDateFromTimestamp } from '../../utils/formatDateFromTimestamp';
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const defaultValues = {
  title: '',
  is_enabled: 1,
  percent: 100,
  due_date: '',
  code: ''
}

const CouponModal = forwardRef<ModalRef, AdminCouponModalProps>(({ selectedCoupon, getCoupons }, ref) => {
  const dispatch = useAppDispatch();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const modal = useRef<Modal | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onTouched',
    defaultValues
  });

  // Modal 實體
  useEffect(() => {
    if (modalRef.current) {
      modal.current = new Modal(modalRef.current);
    }
  }, []);

  const [isEnabled] = useWatch({
    control,
    name: ['is_enabled'], // 同時監聽多個欄位
  });

  // 送出表單
  const onSubmit = async (data: unknown) => {
    try {
      dispatch(setIsFullPageLoading(true));
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)andBloom\s*=\s*([^;]*).*$)|^.*$/,"$1",);
      axios.defaults.headers.common.Authorization = token;
      const res = await axios[!selectedCoupon ? 'post' : 'put'](
        `${VITE_API_BASE}/api/${VITE_API_PATH}/admin/coupon${selectedCoupon ? `/${selectedCoupon.id}` : ''}`,
        { data }
      );
      getCoupons();
      modal.current?.hide();
      dispatch(asyncSetMessage({ text: res?.data.message, type: 'success' }));
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err?.response?.data.message);
        dispatch(asyncSetMessage({ text: err?.response?.data.message, type: 'danger' }));
      }
    } finally {
      dispatch(setIsFullPageLoading(false));
    }
  };

  // 清空表單
  useEffect(() => {
    const currentModalRef = modalRef.current;
    const handleModalHidden = () => {
      reset(defaultValues);
    };
    currentModalRef?.addEventListener('hidden.bs.modal', handleModalHidden);
    return () => currentModalRef?.removeEventListener('hidden.bs.modal', handleModalHidden);
  }, [modalRef, reset]);

  // 編輯表單預設值
  useEffect(() => {
    const currentModalRef = modalRef.current;
    const handleModalOpen = () => {
      if (selectedCoupon) {
        reset({
          ...selectedCoupon,
          due_date: formatDateFromTimestamp(selectedCoupon.due_date)
        });
      }
    };
    currentModalRef?.addEventListener('shown.bs.modal', handleModalOpen);
    return () => currentModalRef?.removeEventListener('shown.bs.modal', handleModalOpen);
  }, [selectedCoupon, modalRef, reset]);

  // 讓父元件可以呼叫子元件方法
  useImperativeHandle(ref, () => ({
    show: () => {
      modal.current?.show();
    },
    hide: () => {
      modal.current?.hide();
    }
  }));

  return (
    <div className="modal fade" data-bs-backdrop="static" tabIndex={-1} ref={modalRef}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title fs-5">{!selectedCoupon ? '新增優惠券' : '編輯優惠券'}</h2>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <div className="row">
                <div className="mb-3">
                  <FormInput id="title" label="優惠券名稱" type="text" placeholder="請輸入名稱"
                    register={register} errors={errors}
                    rules={{
                      required: '優惠券名稱必填'
                    }} />
                </div>
                <div className="mb-3">
                  <FormInput id="code" label="優惠券代碼" type="text" placeholder="請輸入代碼"
                    register={register} errors={errors}
                    rules={{
                      required: '優惠券代碼必填'
                    }} />
                </div>
                <div className="col-md-6 mb-3">
                  <FormInput id="percent" label="折扣數" type="number" placeholder="請輸入折扣數"
                    register={register} errors={errors}
                    rules={{
                      required: '折扣數必填',
                      min: {
                        value: 50,
                        message: '折扣數需大於 50'
                      },
                      max: {
                        value: 100,
                        message: '折扣數需小於等於 100'
                      },
                      valueAsNumber: true
                    }} />
                </div>
                <div className="col-md-6 mb-3">
                  <FormInput id="due_date" label="到期日" type="date" placeholder="請輸入到期日"
                    register={register} errors={errors}
                    rules={{
                      required: '到期日必填',
                      setValueAs: (value: Date) => (value ? (new Date(value).getTime() / 1000) : null)
                    }} />
                </div>
                <div className="mb-3">
                  <Field id="is_enabled" label="是否啟用" errors={errors}>
                    <div className={`d-block ${errors.is_enabled && "is-invalid"}`} role="group">
                      <input type="checkbox" className="btn-check" id="enabled" {...register('is_enabled')} />
                      <label className={`btn px-4 ${isEnabled ? 'btn-success' : 'btn-danger'}`} htmlFor="enabled">
                        {isEnabled ? '啟用' : '停用'}
                      </label>
                    </div>
                  </Field>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button btnStyle="btn btn-outline-secondary px-4" data-bs-dismiss="modal">取消</Button>
              <Button type="submit" btnStyle="btn btn-secondary px-4">儲存</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
});

export default memo(CouponModal);
