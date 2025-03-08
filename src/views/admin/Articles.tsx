import axios, { AxiosError } from 'axios';
import 'bootstrap';
import { useCallback, useEffect, useRef, useState } from 'react';
import ProductListItem from '../../components/admin/ProductListItem';
import AlertModal from '../../components/AlertModal';
import Button from '../../components/Button';
import Pagination from '../../components/Pagination';
import { setIsFullPageLoading } from '../../slice/loadingSlice';
import { asyncSetMessage } from '../../slice/toastSlice';
import { useAppDispatch } from '../../store';
import type { ModalRef } from '../../types/modal';
import { Article } from '../../types/article';
import ArticleListItem from '../../components/admin/ArticleListItem';
import ArticleModal from '../../components/admin/ArticleModal';
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const AdminArticles = () => {
  const dispatch = useAppDispatch();
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [TotalPages, setTotalPages] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const modalRef = useRef<ModalRef | null>(null);
  const alertModalRef = useRef<ModalRef | null>(null);

  // 取得列表
  const getList = useCallback(async () => {
    try {
      dispatch(setIsFullPageLoading(true));
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)andBloom\s*=\s*([^;]*).*$)|^.*$/,"$1",);
      axios.defaults.headers.common.Authorization = token;
      const res = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/admin/articles?page=${currentPage}`);
      setArticles(res.data.articles);
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
    getList();
  }, [getList]);

  // 顯示 Modal
  const showModal = useCallback(() => {
    modalRef.current?.show();
  }, []);

  // 顯示 Alert Modal
  const showAlertModal = useCallback(() => {
    alertModalRef.current?.show();
  }, []);

  // 新增產品
  const addArticle = useCallback(() => {
    setSelectedArticle(null);
    showModal();
  }, [showModal]);

  // 刪除商品
  const deleteArticle = useCallback(async (id: string) => {
    if (!id) return;

    try {
      dispatch(setIsFullPageLoading(true));
      const res = await axios.delete(`${VITE_API_BASE}/api/${VITE_API_PATH}/admin/product/${id}`);
      dispatch(asyncSetMessage({ text: res?.data.message, type: 'success' }));
      getList();
      alertModalRef.current?.hide();
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err?.response?.data.message);
        dispatch(asyncSetMessage({ text: err?.response?.data.message, type: 'danger' }));
      }
    } finally {
      dispatch(setIsFullPageLoading(false));
      setSelectedArticle(null);
    }
  }, [dispatch, getList]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom">
        <h3 className="mb-0">文章列表</h3>
        <Button btnStyle="btn-sm btn-secondary" handleClick={addArticle}>新增</Button>
      </div>
      {
        articles.length
        ? <>
            {articles.map((item) => (
              <ArticleListItem showModal={showModal} setSelectedArticle={setSelectedArticle} showAlertModal={showAlertModal}
                article={item} key={item.id} />
            ))}
            <div className="d-flex justify-content-center my-5">
              <Pagination currentPage={currentPage} totalPages={TotalPages} setCurrentPage={setCurrentPage} />
            </div>
          </>
        : <p className="text-center">尚無文章，請新增文章</p>
      }

      <ArticleModal
        ref={modalRef}
        selectedArticle={selectedArticle}
        getList={getList}
      />

      <AlertModal ref={alertModalRef} nextFn={() => deleteArticle(selectedArticle?.id || '')}>
        <p className="text-center py-4">刪除後無法復原，您確定刪除<strong>{selectedArticle?.title}</strong>嗎？</p>
      </AlertModal>
    </>
  )
}

export default AdminArticles;
