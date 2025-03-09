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
import FormTextarea from '../form/FormTextarea';
import { AdminArticleModalProps } from '../../types/article';
import TheCkeditor from './TheCkeditor';
import { formatDateFromTimestamp } from "../../utils/formatDateFromTimestamp";
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const defaultValues = {
  author: '',
  description: '',
  image: '',
  isPublic: true,
  tag: [],
  title: '',
  content: ''
}

const ArticleModal = forwardRef<ModalRef, AdminArticleModalProps>(({ selectedArticle, getList }, ref) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const modal = useRef<Modal | null>(null);
  const [tempTag, setTempTag] = useState('');
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

  const [image, isPublic, tag, content] = useWatch({
    control,
    name: ['image', 'isPublic', 'tag', 'content'], // 同時監聽多個欄位
  });

  // 上傳圖片
  const handleUploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const formData = new FormData();
    if (!file) {
      return;
    }
    formData.append('file-to-upload', file);
    e.target.files = new DataTransfer().files;
    try {
      setIsLoading(true);
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)andBloom\s*=\s*([^;]*).*$)|^.*$/,"$1",);
      axios.defaults.headers.common.Authorization = token;
      const res = await axios.post(`${VITE_API_BASE}/api/${VITE_API_PATH}/admin/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setValue('image', res.data.imageUrl, { shouldValidate: true });
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err?.response?.data.message);
        dispatch(asyncSetMessage({ text: err?.response?.data.message, type: 'danger' }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 送出表單
  const onSubmit = async (data: unknown) => {
    try {
      dispatch(setIsFullPageLoading(true));
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)andBloom\s*=\s*([^;]*).*$)|^.*$/,"$1",);
      axios.defaults.headers.common.Authorization = token;
      const res = await axios[!selectedArticle ? 'post' : 'put'](
        `${VITE_API_BASE}/api/${VITE_API_PATH}/admin/article${selectedArticle ? `/${selectedArticle.id}` : ''}`,
        { data }
      );
      getList();
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
    const handleModalOpen = async () => {
      if (selectedArticle) {
        try {
          dispatch(setIsFullPageLoading(true));
          const token = document.cookie.replace(/(?:(?:^|.*;\s*)andBloom\s*=\s*([^;]*).*$)|^.*$/,"$1",);
          axios.defaults.headers.common.Authorization = token;
          const res = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/admin/article/${selectedArticle.id}`);
          reset({
            ...selectedArticle,
            content: res.data.article?.content,
            create_at: formatDateFromTimestamp(selectedArticle.create_at)
          });
        } catch (err) {
          if (err instanceof AxiosError) {
            console.log(err?.response?.data.message);
          }
        } finally {
          dispatch(setIsFullPageLoading(false));
        }
      }
    };
    currentModalRef?.addEventListener('shown.bs.modal', handleModalOpen);
    return () => currentModalRef?.removeEventListener('shown.bs.modal', handleModalOpen);
  }, [selectedArticle, modalRef, reset, dispatch]);

  // 讓父元件可以呼叫子元件方法
  useImperativeHandle(ref, () => ({
    show: () => {
      modal.current?.show();
    },
    hide: () => {
      modal.current?.hide();
    }
  }));

  const removeTag = (index: number) => {
    const newTags = [...tag];
    newTags.splice(index, 1);
    setValue('tag', newTags);
  }

  const addTag = () => {
    setValue('tag', [...tag, tempTag]);
    setTempTag('');
  }

  const setContent = (data: string) => {
    setValue('content', data);
  }

  return (
    <div className="modal fade" data-bs-backdrop="static" tabIndex={-1} ref={modalRef}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title fs-5">{!selectedArticle ? '新增文章' : '編輯文章'}</h2>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <div className="row">
                <div className="mb-3">
                  <FormInput id="title" label="文章標題" type="text" placeholder="請輸入標題"
                    register={register} errors={errors}
                    rules={{
                      required: '文章標題必填'
                    }} />
                </div>
                <div className="mb-3">
                  <FormInput id="author" label="作者" type="text" placeholder="請輸入作者"
                    register={register} errors={errors}
                    rules={{
                      required: '作者必填'
                    }} />
                </div>
                <div className="col-lg-6 mb-3">
                  <Field id="tag" label="文章標籤" errors={errors}>
                    <div className={`d-block ${errors.is_enabled && "is-invalid"}`}>
                      <div className="input-group">
                        <input type="text" className="form-control w-auto" placeholder="請輸入標籤" value={tempTag} onChange={(e) => setTempTag(e.target.value)} />
                        <button className="btn btn-secondary" type="button" onClick={addTag}>
                          加入標籤
                        </button>
                      </div>
                      {
                        tag?.map((item: string, index: number) => {
                          return <span className="badge rounded-pill bg-primary mt-2 me-2" key={`tag-${index}`}>
                            {item}
                            <i className="bi bi-x-lg opacity-75 cursor-pointer ps-1" onClick={() => removeTag(index)} />
                          </span>
                        })
                      }
                    </div>
                  </Field>
                </div>
                <div className="col-lg-6 mb-3">
                  <FormInput id="create_at" label="文章日期" type="date" placeholder="請輸入文章日期"
                    register={register} errors={errors}
                    rules={{
                      required: '文章日期必填',
                      setValueAs: (value: Date) => (value ? (new Date(value).getTime() / 1000) : null)
                    }} />
                </div>
                <div className="mb-3">
                  <Field id="is_enabled" label="是否公開" errors={errors}>
                    <div className={`d-block ${errors.is_enabled && "is-invalid"}`} role="group">
                      <input type="checkbox" className="btn-check" id="enabled" {...register('is_enabled')} />
                      <label className={`btn px-4 ${isPublic ? 'btn-success' : 'btn-danger'}`} htmlFor="enabled">
                        {isPublic ? '公開' : '隱藏'}
                      </label>
                    </div>
                  </Field>
                </div>
                <div className="col-md-6 mb-3">
                  <Field id="image" label="文章主圖" isRequired={true} errors={errors}>
                    <div>
                      <input
                        id="mainImage"
                        type="file"
                        className="form-control d-none"
                        disabled={!!isLoading}
                        onChange={handleUploadImage}
                      />
                      <label className={`btn btn-primary ${isLoading && 'opacity-50'}`} htmlFor="mainImage" >
                        {isLoading && <span className="spinner-grow spinner-grow-sm me-2"></span>}
                        上傳圖片
                      </label>
                    </div>
                    {image && <img src={image} alt="主圖" className="img-fluid mt-3" />}
                    <input
                      id="image"
                      className={`form-control-sm form-control-plaintext ${image ? '' : 'd-none'}`}
                      readOnly
                      {...register('image', {
                        required: '請上傳主圖'
                      })}
                    />
                  </Field>
                </div>
                <div className="mb-3">
                  <FormTextarea id="description" label="文章說明" placeholder="請輸入文章內容"
                    register={register} errors={errors}
                    rules={{
                      required: '文章說明必填'
                    }} />
                </div>
                <div className="mb-3">
                  <Field id="content" label="內文" errors={errors} isRequired={true}>
                    <TheCkeditor content={content} setContent={setContent} />
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

export default memo(ArticleModal);
