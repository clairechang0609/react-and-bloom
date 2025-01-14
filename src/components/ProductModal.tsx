import { useEffect, FC, ChangeEvent } from 'react';
import axios, { AxiosError } from 'axios';
import Field from './Form/Field';
import FormTextarea from './Form/FormTextarea';
import FormInput from './Form/FormInput';
import Button from './Button';
import type { ProductModalProps } from '../types/product';
import { useForm, FieldValues } from 'react-hook-form';

const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

// 設定 Authorization
const setAuthorization = () => {
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)andBloom\s*=\s*([^;]*).*$)|^.*$/,"$1",);
  axios.defaults.headers.common.Authorization = token;
}

const ProductModal: FC<ProductModalProps> = ({ modalRef, isNewProduct }) => {
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
    defaultValues: {
      title: '',
      category: '',
      unit: '',
      origin_price: null,
      price: null,
      description: '',
      content: '',
      is_enabled: '1',
      imageUrl: '',
      imagesUrl: [],
    }
  });

  const uploadImage = async (e: ChangeEvent<HTMLInputElement>, type: 'imageUrl' | 'imagesUrl') => {
    const file = e.target.files?.[0];
    const formData = new FormData();
    if (!file) {
      return;
    }
    formData.append('file-to-upload', file);
    e.target.files = new DataTransfer().files;
    try {
      setAuthorization();
      const res = await axios.post(`${VITE_API_BASE}/api/${VITE_API_PATH}/admin/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (type === 'imageUrl') {
        setValue('imageUrl', res.data.imageUrl);
      } else {
        setValue('imagesUrl', [...getValues('imagesUrl'), res.data.imageUrl]);
      }
    } catch (err) {
      console.error('文件上傳失敗:', err);
    }
  }

  const onSubmit = (data: unknown) => {
    console.log(data);
  }

  useEffect(() => {
    const currentModalRef = modalRef.current;
    const handleModalHidden = () => {
      reset();
    };
    currentModalRef?.addEventListener('hidden.bs.modal', handleModalHidden);
    return () => currentModalRef?.removeEventListener('hidden.bs.modal', handleModalHidden);
  }, [modalRef, reset]);

  return (
    <div className="modal fade" data-bs-backdrop="static" tabIndex={-1} aria-labelledby="modalTitle" aria-hidden="true" ref={modalRef}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="modalTitle">{isNewProduct ? '新增產品' : '編輯產品'}</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <div className="row">
                <div className="mb-3">
                  <FormInput id="title" label="產品名稱" type="text" placeholder="請輸入名稱"
                    register={register} errors={errors}
                    rules={{
                      required: '產品名稱必填'
                    }} />
                </div>
                <div className="col-md-6 mb-3">
                  <FormInput id="category" label="分類" type="text" placeholder="請輸入分類"
                    register={register} errors={errors}
                    rules={{
                      required: '分類必填'
                    }} />
                </div>
                <div className="col-md-6 mb-3">
                  <FormInput id="unit" label="單位" type="text" placeholder="請輸入單位"
                    register={register} errors={errors}
                    rules={{
                      required: '單位必填'
                    }} />
                </div>
                <div className="col-md-6 mb-3">
                  <FormInput id="origin_price" label="原價" type="number" placeholder="請輸入原價"
                    register={register} errors={errors}
                    rules={{
                      required: '原價必填'
                    }} />
                </div>
                <div className="col-md-6 mb-3">
                  <FormInput id="price" label="售價" type="number" placeholder="請輸入售價"
                    register={register} errors={errors}
                    rules={{
                      required: '售價必填',
                      validate: (value: string) => Number(value) < Number(getValues().origin_price) || '售價必須小於原價'
                    }} />
                </div>
                <div className="mb-3">
                  <FormTextarea id="description" label="產品描述" placeholder="請輸入產品描述"
                    register={register} errors={errors} />
                </div>
                <div className="mb-3">
                  <FormTextarea id="content" label="說明內容" placeholder="請輸入說明內容"
                    register={register} errors={errors} />
                </div>
                <div className="mb-3">
                  <Field id="is_enabled" label="是否啟用" isRequired={true} errors={errors}>
                    <div className={`btn-group btn-group-sm d-block ${errors.is_enabled && "is-invalid"}`} role="group">
                      <input type="radio" className="btn-check" id="enabled" value={1} {...register('is_enabled', {
                      required: '請選擇是否啟用'
                    })} />
                      <label className="btn btn-outline-secondary px-4" htmlFor="enabled">啟用</label>
                      <input type="radio" className="btn-check" id="disabled" value={0} {...register('is_enabled', {
                      required: '請選擇是否啟用'
                    })} />
                      <label className="btn btn-outline-secondary px-4" htmlFor="disabled">停用</label>
                    </div>
                  </Field>
                </div>
                <div className="col-md-6 mb-3">
                  <Field id="imageUrl" label="主圖" isRequired={true} errors={errors}>
                  <input
                    type="file"
                    id="imageUrl"
                    className="form-control"
                    onChange={(e) => uploadImage(e, 'imageUrl')}
                  />
                  <img src={getValues().imageUrl} alt="主圖" className="img-fluid mt-3" />
                  <input
                    type="input"
                    id="imageUrl"
                    className="form-control-sm form-control-plaintext"
                    readOnly
                    {...register('imageUrl', {
                      required: '請上傳主圖'
                    })}
                  />
                  </Field>
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
}

export default ProductModal;
