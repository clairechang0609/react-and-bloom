import axios, { AxiosError } from 'axios';
import { Modal } from 'bootstrap';
import { forwardRef, memo, useEffect, useImperativeHandle, useRef } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { setIsFullPageLoading } from '../../slice/loadingSlice';
import { asyncSetMessage } from '../../slice/toastSlice';
import { useAppDispatch } from '../../store';
import type { ModalRef } from '../../types/modal';
import type { AdminOrderModalProps, OrderProductDetail } from '../../types/order';
import Button from '../Button';
import Field from '../form/Field';
import FormInput from '../form/FormInput';
import FormTextarea from '../form/FormTextarea';
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const defaultValues = {
    create_at: '',
    id: '',
    is_paid: false,
    message: '',
    products: {},
    user: {
      address: '',
      email: '',
      name: '',
      tel: ''
    },
    num: 0,
    total: 0,
    remark: ''
}

const OrderModal = forwardRef<ModalRef, AdminOrderModalProps>(({
    selectedOrder,
    getOrders
  }, ref) => {
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

  const [id, products, user, total, message, isPaid] = watch(['id', 'products', 'user', 'total', 'message', 'is_paid']);

  // Modal 實體
  useEffect(() => {
    if (modalRef.current) {
      modal.current = new Modal(modalRef.current);
    }
  }, []);

  // 送出表單
  const onSubmit = async (data: unknown) => {
    try {
      dispatch(setIsFullPageLoading(true));
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)andBloom\s*=\s*([^;]*).*$)|^.*$/,"$1",);
      axios.defaults.headers.common.Authorization = token;
      const res = await axios.put(
        `${VITE_API_BASE}/api/${VITE_API_PATH}/admin/order/${selectedOrder?.id}`,
        { data }
      );
      getOrders();
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
      if (selectedOrder) {
        reset(selectedOrder);
      }
    };
    currentModalRef?.addEventListener('shown.bs.modal', handleModalOpen);
    return () => currentModalRef?.removeEventListener('shown.bs.modal', handleModalOpen);
  }, [selectedOrder, modalRef, reset]);

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
            <h2 className="modal-title fs-5">編輯訂單</h2>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label d-block mb-1">訂購者</label>
                  <input type="text" className="form-control-plaintext" value={user.name} readOnly />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label d-block mb-1">Email</label>
                  <input type="email" className="form-control-plaintext" value={user.email} readOnly />
                </div>
                <div className="col-md-6 mb-3">
                <FormInput id="user.tel" label="訂購者電話" type="tel" placeholder="請輸入訂購者電話"
                  register={register} errors={errors}
                  rules={{
                    required: '電話必填',
                    minLength: {
                      value: 8,
                      message: '電話不少於 8 碼',
                    },
                    maxLength: {
                      value: 12,
                      message: '電話不大於 12 碼',
                    },
                    pattern: {
                      value: /^[0-9]*$/,
                      message: '電話需為數字'
                    }
                  }} />
                </div>
                <div className="col-md-6 mb-4">
                  <FormInput id="user.address" label="收件地址" type="text" placeholder="請輸入收件地址"
                    register={register} errors={errors}
                    rules={{
                      required: '收件地址必填'
                    }} />
                </div>
                <div className="mb-3">
                  <label className="form-label d-block mb-1">訂購品項</label>
                  <div className="row gx-2 text-dark">
                    <div className="col-4">
                      <small className="d-block p-1 my-1 border-bottom">產品名稱</small>
                    </div>
                    <div className="col-2">
                      <small className="d-block p-1 my-1 border-bottom">數量</small>
                    </div>
                    <div className="col-3">
                      <small className="d-block p-1 my-1 border-bottom">單價</small>
                    </div>
                    <div className="col-3">
                      <small className="d-block p-1 my-1 border-bottom">小計</small>
                    </div>
                  </div>
                  {
                    Object.values(products as Record<string, OrderProductDetail>).map((item: OrderProductDetail) => {
                      return (
                        <div className="row gx-2" key={`modal-${id}-${item.id}`}>
                          <div className="col-4">
                            <div className="p-1 my-1 border-bottom">{item.product.title}</div>
                          </div>
                          <div className="col-2">
                            <div className="p-1 my-1 border-bottom">{item.qty}</div>
                          </div>
                          <div className="col-3">
                            <div className="p-1 my-1 border-bottom">${item.product.price}</div>
                          </div>
                          <div className="col-3">
                            <div className="p-1 my-1 border-bottom">${item.total}</div>
                          </div>
                        </div>
                      )
                    })
                  }
                  <div className="row gx-2 fw-bold">
                    <div className="col-9">
                      <div className="d-block p-1 my-1 border-bottom">總金額</div>
                    </div>
                    <div className="col-3">
                      <div className="d-block p-1 my-1 border-bottom text-danger">${total}</div>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <Field id="is_paid" label="是否付款" errors={errors}>
                    <div className={`d-block ${errors.is_paid && "is-invalid"}`} role="group">
                      <input type="checkbox" className="btn-check" id="paid" {...register('is_paid')} />
                      <label className={`btn px-4 ${isPaid ? 'btn-success' : 'btn-danger'}`} htmlFor="paid">
                        {isPaid ? '已付款' : '未付款'}
                      </label>
                    </div>
                  </Field>
                </div>
                <div className="mb-3">
                  <label className="form-label d-block mb-1">訂單留言</label>
                  <textarea className="form-control" rows={3} value={message} readOnly disabled />
                </div>
                <div className="mb-3">
                  <FormTextarea id="rematk" label="管理者備註" placeholder="請輸入管理者備註"
                    register={register} errors={errors} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button btnStyle="btn btn-outline-secondary" data-bs-dismiss="modal">取消</Button>
              <Button type="submit" btnStyle="btn btn-secondary">儲存</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
});

export default memo(OrderModal);
