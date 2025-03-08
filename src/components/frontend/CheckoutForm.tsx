import axios, { AxiosError } from 'axios';
import { FC, memo, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { asyncGetCart } from '../../slice/cartSlice';
import { setIsFullPageLoading } from '../../slice/loadingSlice';
import { asyncSetMessage } from '../../slice/toastSlice';
import { useAppDispatch } from '../../store';
import Button from '../Button';
import FloatLabelInput from '../form/FloatLabelInput';
import FloatLabelTextarea from '../form/FloatLabelTextarea';
import { useNavigate } from 'react-router';
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const defaultValues = {
  name: '',
  email: '',
  tel: '',
  address: '',
  message: ''
}

const CheckoutForm: FC = memo(() => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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

  // 送出表單
  const onSubmit = async (data: unknown) => {
    const { message, ...user } = data as Record<string, string>;
    try {
      dispatch(setIsFullPageLoading(true));
      const res = await axios.post(
        `${VITE_API_BASE}/api/${VITE_API_PATH}/order`,
        {
          data: { user, message }
        }
      );
      await dispatch(asyncGetCart());
      reset(defaultValues);
      navigate(`/checkout/${res.data.orderId}`);
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err?.response?.data.message);
        dispatch(asyncSetMessage({ text: err?.response?.data.message, type: 'danger' }));
      }
    } finally {
      dispatch(setIsFullPageLoading(false));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="mb-3">
          <FloatLabelInput id="name" label="收件人" type="text" placeholder="收件人姓名"
            register={register} errors={errors}
            rules={{
              required: '姓名必填'
            }} />
        </div>
        <div className="mb-3">
          <FloatLabelInput id="tel" label="收件人電話" type="tel" placeholder="收件人電話"
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
        <div className="mb-3">
          <FloatLabelInput id="address" label="收件人地址" type="text" placeholder="收件人地址"
            register={register} errors={errors}
            rules={{
              required: '收件人地址必填'
            }} />
        </div>
        <div className="mb-3">
          <FloatLabelInput id="email" label="Email" type="email" placeholder=" Email"
            register={register} errors={errors}
            rules={{
              required: 'Email 必填',
              pattern: {
                value: /^\S+@\S+$/,
                message: 'Email 格式錯誤'
              }
            }} />
        </div>
        <div className="">
          <FloatLabelTextarea id="message" label="備註" placeholder="備註"
            register={register} errors={errors} />
        </div>
      </div>
      <Button type="submit" btnStyle="btn btn-secondary w-100 mt-5">結帳</Button>
    </form>
  )
});

export default CheckoutForm;
