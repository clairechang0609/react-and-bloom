import { FC } from "react";
import { NavLink } from "react-router";
import { createGlobalStyle } from "styled-components";
import { Product } from "../../../types/product";
import ProductCard from "../ProductCard";

const Global = createGlobalStyle`
  .product-card-wrap {
    max-width: 750px;
    width: 100%;
  }

  .fixed_wrapper {
    margin-top: 100px;
  }

  .fixed, .fixed_target {
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
  }

  .fixed_target {
    bottom: 200px;
    top: -100px;
  }


  .btn-arrow {
    right: 1.5rem;
    transition: 0.25s ease-in;
  }

  .btn:hover .btn-arrow {
    right: 0.75rem;
  }
`;

const NewProducts: FC<{ filterProducts: Product[] }> = ({ filterProducts }) => {
    return (
      <>
        <Global />
        <div className="row">
          <div className="col-md-5 fixed_wrapper position-relative overflow-hidden">
            <div className="fixed_target" id="fixed-target"></div>
            <div className="fixed d-flex flex-column align-items-center text-center" data-scroll data-scroll-sticky data-scroll-target="#fixed-target">
              <h3 className="title fs-2 mb-3">＼ New Items ／</h3>
              <small className="d-block">
                最新植栽推薦 <br />
                快來挑選你的居家綠色夥伴
              </small>
              <svg className="d-block text-white mt-4" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="50px" version="1.1" id="Capa_1" viewBox="0 0 227.096 227.096" xmlSpace="preserve">
                <g>
                  <polygon points="152.835,39.285 146.933,45.183 211.113,109.373 0,109.373 0,117.723 211.124,117.723 146.933,181.902 152.835,187.811 227.096,113.55   "/>
                </g>
              </svg>
            </div>
          </div>
          <div style={{ marginTop: '-5rem' }} className="col-md-7 text-center" data-scroll data-scroll-delay="0.04" data-scroll-speed="5">
            <div className="product-card-wrap pe-5">
              {
                filterProducts.length
                  ? <>
                    {
                      filterProducts.map(item => {
                        return <div className="mb-5 text-start" key={item.id}>
                          <ProductCard item={item}>
                            <small className="d-block mt-3 text-dark">
                              <small>{item.description}</small>
                            </small>
                          </ProductCard>
                        </div>
                      })
                    }
                    </>
                  : ''
              }
              <NavLink to="/products" className="btn btn-secondary rounded-pill px-5 mt-4 position-relative">
                所有植栽
                <span className="btn-arrow ms-3 position-absolute">→</span>
              </NavLink>
            </div>
          </div>
        </div>
      </>
    )
}

export default NewProducts
