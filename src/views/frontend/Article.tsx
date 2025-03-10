import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import styled from "styled-components";
import { setIsFullPageLoading } from "../../slice/loadingSlice";
import { useAppDispatch } from "../../store";
import { Article } from "../../types/article";
import { formatDateFromTimestamp } from "../../utils/formatDateFromTimestamp";
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const ImageWrap = styled("div")`
  aspect-ratio: 2 / 1;
  background: linear-gradient(135deg, #42b983, #ffed6e);
  margin-top: -70px;

  @media screen and (min-width: 768px) {
    aspect-ratio: 4 / 1;
  }
`;

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
      <ImageWrap className="overflow-hidden">
        <img src={article?.image} alt={article?.title} className="object-fit-cover h-100 w-100 opacity-50" style={{ filter: 'grayscale(50%)' }} />
      </ImageWrap>
      <div className="container my-5">
        <div className="mb-3">
          {
            article?.tag?.map((item, index) => {
              return <span className="badge rounded-pill bg-primary fs-sm mb-1 me-1" key={`tag-${index}`}>{item}</span>
            })
          }
        </div>
        <div className="pb-3 mb-3 d-flex flex-column flex-lg-row align-items-lg-end justify-content-between border-bottom">
          <h2 className="fw-light mb-0 order-2 order-lg-1">{article?.title}</h2>
          <p className="mb-lg-0 order-1 order-lg-2">{article?.create_at && formatDateFromTimestamp(article.create_at)}</p>
        </div>
        <p className="mb-5"><small>Posted by_</small> {article?.author}</p>
        { article?.content ? <div className="ck-content" dangerouslySetInnerHTML={{ __html: article.content }} /> : '' }
      </div>
    </>
  )
}

export default ArticlePage;
