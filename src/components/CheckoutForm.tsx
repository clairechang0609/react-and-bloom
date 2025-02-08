import axios, { AxiosError } from 'axios';
import { FC, memo } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { CheckoutFormProps } from '../types/cart';
import Button from './Button';
import FormInput from './Form/FormInput';
import FormTextarea from './Form/FormTextarea';

const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const defaultValues = {
  name: '',
  email: '',
  tel: '',
  address: '',
  message: ''
}

const CheckoutForm: FC<CheckoutFormProps> = memo(({ setIsFullPageLoading, showToast, getCart }) => {
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
      setIsFullPageLoading(true);
      const res = await axios.post(
        `${VITE_API_BASE}/api/${VITE_API_PATH}/order`,
        {
          data: { user, message }
        }
      );
      getCart();
      showToast(res?.data.message, 'success');
      reset(defaultValues);
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err?.response?.data.message);
        showToast(err?.response?.data.message, 'danger');
      }
    } finally {
      setIsFullPageLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="mb-3">
          <FormInput id="email" label="Email" type="email" placeholder="請輸入 Email"
            register={register} errors={errors}
            rules={{
              required: 'Email 必填',
              pattern: {
                value: /^\S+@\S+$/,
                message: 'Email 格式錯誤'
              }
            }} />
        </div>
        <div className="mb-3">
          <FormInput id="name" label="收件人" type="text" placeholder="請輸入收件人姓名"
            register={register} errors={errors}
            rules={{
              required: '姓名必填'
            }} />
        </div>
        <div className="mb-3">
          <FormInput id="tel" label="收件人電話" type="tel" placeholder="請輸入收件人電話"
            register={register} errors={errors}
            rules={{
              required: '電話必填',
              minLength: {
                value: 6,
                message: '電話不少於 6 碼',
              },
              maxLength: {
                value: 12,
                message: '電話不大於 12 碼',
              }
            }} />
        </div>
        <div className="mb-3">
          <FormInput id="address" label="收件人地址" type="text" placeholder="請輸入收件人地址"
            register={register} errors={errors}
            rules={{
              required: '收件人地址必填'
            }} />
        </div>
        <div className="mb-3">
          <FormTextarea id="message" label="備註" placeholder="請輸入備註"
            register={register} errors={errors} />
        </div>
      </div>
      <Button type="submit" btnStyle="btn btn-secondary w-100">送出訂單</Button>
    </form>
  )
});

export default CheckoutForm;
