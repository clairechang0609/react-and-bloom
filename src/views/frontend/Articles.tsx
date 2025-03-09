import { useMemo } from "react";
import useGetArticles from "../../hooks/frontend/useGetArticles";
import { formatDateFromTimestamp } from "../../utils/formatDateFromTimestamp";
import { NavLink } from "react-router";
import Pagination from '../../components/Pagination';

const Articles = () => {
  const { articles, currentPage, setCurrentPage, totalPages } = useGetArticles();

  return (
    <div className="container my-5">
      <div className="row mb-5">
        <div className="col-md-7" style={{ aspectRatio: '5 / 2' }}>
          <img src={articles[0]?.image} alt={articles[0]?.title} className="object-fit-cover h-100 w-100" />
        </div>
        <div className="col-md-5">
          <div className="mb-3">
            {
              articles[0]?.tag?.map((item, index) => {
                return <span className="badge rounded-pill bg-primary fs-sm mb-1 me-1" key={`tag-${index}`}>{item}</span>
              })
            }
          </div>
          <h3 className="fw-light pb-3 mb-3 border-bottom">{articles[0]?.title}</h3>
          <div className="mb-3 d-flex align-items-end justify-content-between">
            <p className="mb-0">{articles[0]?.create_at && formatDateFromTimestamp(articles[0]?.create_at)}</p>
            <p className="mb-0"><small>Posted by_</small> {articles[0]?.author}</p>
          </div>
          <p className="mb-3 text-ellipsis lh-lg" style={{ fontSize: '0.9rem' }}>{articles[0]?.description}</p>
          <NavLink to={`/article/${articles[0]?.id}`} className="btn btn-secondary rounded-pill px-5 position-relative">
            看更多
            <span className="btn-arrow ms-3 position-absolute">→</span>
          </NavLink>
        </div>
      </div>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
        {
          articles?.slice(1)?.map(item => {
            return (
              <NavLink to={`/article/${item.id}`} key={item.id}>
                <div className="position-relative mb-3" style={{ aspectRatio: '4 / 3' }}>
                  <img src={item.image} alt={item.title} className="object-fit-cover h-100 w-100" />
                  <div className="position-absolute bg-white bg-opacity-50" style={{ bottom: 0, left: 0, right: 0 }}>
                    <div className="p-2">
                      {
                        item.tag?.map((item, index) => {
                          return <span className="badge rounded-pill bg-primary fs-sm mb-y me-1" key={`tag-${index}`}>{item}</span>
                        })
                      }
                    </div>
                  </div>
                </div>
                <div className="mb-2 d-flex align-items-end justify-content-between">
                  <p className="mb-0">{item.create_at && formatDateFromTimestamp(item.create_at)}</p>
                  <p className="mb-0"><small>Posted by_</small> {item.author}</p>
                </div>
                <h5 className="fw-light">{item.title}</h5>
              </NavLink>
            )
          })
        }
      </div>
      <div className="d-flex justify-content-center my-5">
        <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  )
}

export default Articles;
