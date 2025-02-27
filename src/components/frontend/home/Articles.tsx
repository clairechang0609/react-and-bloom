import { NavLink } from "react-router";
import styled from "styled-components";

const ArticleWrap = styled("div")`
  max-width: 1000px;
  margin: 5rem auto;

  .tags-wrap {
    margin-bottom: 2.5rem;
    padding-bottom: 2.5rem;
    border-bottom: 2px solid black;
  }
`;

const ImageOuter = styled("div")`
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
`;

const Articles = () => {
  // TODO: 串接
  const articleList = [
    {
      id: '1',
      author: 'admin',
      tag: ['日照', '補水'],
      create_at: "2025-02-26",
      title: "植栽照護",
      description: "植物的照護技巧，讓你的植物茁壯成長，植物的照護技巧，讓你的植物茁壯成長，植物的照護技巧，讓你的植物茁壯成長，讓你的植物茁壯成長。",
      image: "./plant-07.jpg",
      content: '這是編輯器內容'
    },
    {
      id: '2',
      author: 'admin',
      tag: ['日照', '補水'],
      create_at: "2025-02-26",
      title: "植栽照護",
      description: "植物的照護技巧，讓你的植物茁壯成長，植物的照護技巧，讓你的植物茁壯成長，植物的照護技巧，讓你的植物茁壯成長，讓你的植物茁壯成長。",
      image: "./plant-07.jpg",
      content: '這是編輯器內容'
    }
  ];

  return (
    <ArticleWrap>
      {
        articleList.map((article, index) => {
          const { tag, create_at, title, description, image, id } = article;

          return (
            <div className="row align-items-center my-5 py-5" key={`article-${index}`}>
              <div className={`col-md-6 px-5 ${index % 2 === 0 ? 'order-md-1' : 'order-md-2'}`}>
                <div data-scroll data-scroll-speed="-1" data-scroll-delay="0.1">
                  <div className="tags-wrap d-flex justify-content-between align-items-center">
                    <small className="tags d-block">{tag.join('｜')}</small>
                    <small className="badge rounded-pill bg-transparent border border-primary text-primary">{create_at}</small>
                  </div>
                  <h5 className="card-title fw-light fs-3 mb-3">{title}</h5>
                  <p className="mb-5">{description}</p>
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

export default Articles
