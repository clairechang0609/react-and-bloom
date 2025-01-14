import { useEffect, FC, ChangeEvent, useState } from 'react';
import axios, { AxiosError } from 'axios';
import Field from './Form/Field';
import FormTextarea from './Form/FormTextarea';
import FormInput from './Form/FormInput';
import Button from './Button';
import type { ProductModalProps } from '../types/product';
import { useForm, FieldValues, useWatch } from 'react-hook-form';
import styled from 'styled-components';

const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const DeleteBtn = styled("div")`
  right: 5px;
  top: 0;
  cursor: pointer;
`;

// 設定 Authorization
const setAuthorization = () => {
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)andBloom\s*=\s*([^;]*).*$)|^.*$/,"$1",);
  axios.defaults.headers.common.Authorization = token;
}

const ProductModal: FC<ProductModalProps> = ({ modalRef, isNewProduct, toast, setToastText, getProducts }) => {
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
      imagesUrl: []
    }
  });

  const [loading, setLoading] = useState('');

  const [imageUrl, imagesUrl] = useWatch({
    control,
    name: ['imageUrl', 'imagesUrl'], // 同時監聽多個欄位
  });

  // 上傳圖片
  const handleUploadImage = async (e: ChangeEvent<HTMLInputElement>, type: 'imageUrl' | 'imagesUrl') => {
    const file = e.target.files?.[0];
    const formData = new FormData();
    if (!file) {
      return;
    }
    formData.append('file-to-upload', file);
    e.target.files = new DataTransfer().files;
    try {
      setLoading(type);
      setAuthorization();
      const res = await axios.post(`${VITE_API_BASE}/api/${VITE_API_PATH}/admin/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (type === 'imageUrl') {
        setValue('imageUrl', res.data.imageUrl);
      } else {
        setValue('imagesUrl', [...imagesUrl, res.data.imageUrl]);
      }
      setLoading('');
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err?.response?.data.message);
        setToastText(err?.response?.data.message);
        toast.current?.show();
      }
      setLoading('');
    }
  }

  // 移除圖片
  const handleRemoveImage = (index: number) => {
    const updatedImagesUrl = [...imagesUrl];
    updatedImagesUrl.splice(index, 1);
    setValue('imagesUrl', updatedImagesUrl);
  }

  // 送出表單
  const onSubmit = async (data: unknown) => {
    try {
      setLoading('full');
      setAuthorization();
      await axios[isNewProduct ? 'post' : 'put'](`${VITE_API_BASE}/api/${VITE_API_PATH}/admin/product`, {
        data
      });
      getProducts();
      setLoading('');
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err?.response?.data.message);
        setToastText(err?.response?.data.message);
        toast.current?.show();
      }
      setLoading('');
    }
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
                    <div className={`btn-group d-block ${errors.is_enabled && "is-invalid"}`} role="group">
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
                    <div>
                      <input
                        id="mainImage"
                        type="file"
                        className="form-control d-none"
                        disabled={!!loading}
                        onChange={(e) => handleUploadImage(e, 'imageUrl')}
                      />
                      <label className={`btn btn-primary ${loading && 'opacity-50'}`} htmlFor="mainImage" >
                        {loading === 'imageUrl' && <span className="spinner-grow spinner-grow-sm me-2" aria-hidden="true"></span>}
                        上傳圖片
                      </label>
                    </div>
                    {imageUrl && <img src={imageUrl} alt="主圖" className="img-fluid mt-3" />}
                    <input
                      id="imageUrl"
                      className={`form-control-sm form-control-plaintext ${imageUrl ? '' : 'd-none'}`}
                      readOnly
                      {...register('imageUrl', {
                        required: '請上傳主圖'
                      })}
                    />
                  </Field>
                </div>
                <div className="col-md-6 mb-3">
                  <Field id="imagesUrl" label="副圖（最多三張）" errors={errors}>
                    <div>
                      <input
                        id="subImages"
                        type="file"
                        className="form-control d-none"
                        disabled={imagesUrl.length >= 3 || !!loading}
                        onChange={(e) => handleUploadImage(e, 'imagesUrl')}
                      />
                      <label className={`btn btn-primary ${(imagesUrl.length >= 3 || !!loading) && 'opacity-50'}`} htmlFor="subImages" >
                        {loading === 'imagesUrl' && <span className="spinner-grow spinner-grow-sm me-2" aria-hidden="true"></span>}
                        上傳圖片
                      </label>
                    </div>
                    {imagesUrl.length > 0 &&
                      imagesUrl.map((item: string, index: number) => {
                        return (
                          <div className="position-relative mt-3 mb-2" key={index}>
                            <img src={item} alt="副圖" className="img-fluid" />
                            <input type="text" className="form-control-sm form-control-plaintext" value={item} />
                            <DeleteBtn className="position-absolute bi bi-x fs-2" onClick={() => handleRemoveImage(index)} />
                          </div>
                        )
                      })
                    }
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
