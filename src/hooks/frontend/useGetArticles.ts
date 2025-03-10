import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { setIsFullPageLoading } from "../../slice/loadingSlice";
import { useAppDispatch } from "../../store";
import { Article } from "../../types/article";
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const useGetArticles = ({ isShowLoading = true }: { isShowLoading?: boolean } = {}) => {
  const dispatch = useAppDispatch();
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getArticles = useCallback(async () => {
    try {
      if (isShowLoading) {
        dispatch(setIsFullPageLoading(true));
      }
      const res = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/articles?${currentPage}`);
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
  }, [currentPage, dispatch, isShowLoading]);

  useEffect(() => {
    getArticles();
  }, [getArticles, currentPage]);

  return {
    articles,
    getArticles,
    currentPage,
    setCurrentPage,
    totalPages
  }
}

export default useGetArticles;
