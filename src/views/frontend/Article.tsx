import { useNavigate, useParams } from "react-router";
import { useAppDispatch } from "../../store";
import { useEffect, useState } from "react";
import { setIsFullPageLoading } from "../../slice/loadingSlice";
import axios, { AxiosError } from "axios";
import { Article } from "../../types/article";
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const ArticlePage = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);

  // 取得文章
  useEffect(() => {
    if (!id) {
      navigate('/articles');
    }
    (async () => {
      try {
        dispatch(setIsFullPageLoading(true));
        const res = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/article/${id}`);
        setArticle(res.data.article);
      } catch (err) {
        if (err instanceof AxiosError) {
          console.log(err?.response?.data.message);
          if (err?.response?.status === 404) {
            navigate('*');
          }
        }
      } finally {
        dispatch(setIsFullPageLoading(false));
      }
    })()
  }, [dispatch, id, navigate]);

  return (
    <>
      <div className="image-wrap position-relative" style={{ height: '250px' }}>
        <img src={article?.image} alt={article?.title} className="object-fit-cover h-100 w-100" />
      </div>
      <div className="container my-5">
        <div className="pb-3 mb-3 d-flex align-items-center justify-content-between border-bottom">
          <h2 className="fs-4 mb-0">{article?.title}</h2>
          <p className="mb-0">Author｜{article?.author}</p>
        </div>
        <div>{article?.content}</div>
      </div>
    </>
  )
}

export default ArticlePage;
