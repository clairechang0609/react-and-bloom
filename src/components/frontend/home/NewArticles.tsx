import { FC } from "react";
import { NavLink } from "react-router";
import styled from "styled-components";
import { Article } from "../../../types/article";
import { formatDateFromTimestamp } from "../../../utils/formatDateFromTimestamp";

const ArticleWrap = styled("div")`
  max-width: 1000px;
  margin: 5rem auto;
  padding-left: env(safe-area-inset-left);
  padding-top: env(safe-area-inset-top);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);

  .tags-wrap {
    margin-bottom: 2.5rem;
    border-bottom: 2px solid black;
    padding-bottom: max(env(safe-area-inset-bottom), 2.5rem);
  }
`;

const ImageOuter = styled("div")`
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  margin-top: 4rem;

  @media screen and (min-width: 768px) {
    margin-top: 0rem;
  }
`;

const NewArticles: FC<{ filterArticles: Article[] }> = ({ filterArticles }) => {
  return (
    <ArticleWrap>
      {
        filterArticles.map((article, index) => {
          const { tag, create_at, title, description, image, id } = article;

          return (
            <div className="row align-items-center my-5 py-5" key={`article-${index}`}>
              <div className={`col-md-6 px-5 ${index % 2 === 0 ? 'order-md-1' : 'order-md-2'}`}>
                <div data-scroll data-scroll-speed="-1" data-scroll-delay="0.1">
                  <div className="tags-wrap d-flex justify-content-between align-items-center">
                    <small className="tags d-block">{tag.join('｜')}</small>
                    <small className="badge rounded-pill bg-transparent border border-primary text-primary">{formatDateFromTimestamp(create_at)}</small>
                  </div>
                  <h5 className="card-title fw-light fs-3 mb-3">{title}</h5>
                  <p className="mb-5 lh-lg" style={{ fontSize: '0.9rem' }}>{description}</p>
                  <NavLink to={`/article/${id}`} className="btn btn-secondary rounded-pill px-5 position-relative">
                    看更多
                    <span className="btn-arrow ms-3 position-absolute">→</span>
                  </NavLink>
                </div>
              </div>
              <div className={`col-md-6 px-5 ${index % 2 === 0 ? 'order-md-2' : 'order-md-1'}`}>
                <ImageOuter>
                  <img src={image} alt={title} className="object-fit-cover h-100 w-100" />
                </ImageOuter>
              </div>
            </div>
          )
        })
      }
    </ArticleWrap>
  )
};

export default NewArticles
