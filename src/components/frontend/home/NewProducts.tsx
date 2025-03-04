import { FC } from "react";
import { NavLink } from "react-router";
import styled from "styled-components";
import { Product } from "../../../types/product";
import ProductCard from "../ProductCard";

const ProductList = styled("div")`
  margin-top: -10rem;

  @media screen and (min-width: 992px) {
    margin-top: -5rem;
  }
`;

const ProductCardWrap = styled("div")`
  max-width: 750px;
  width: 100%;

  @media (min-width: 768px) {
    .product-card {
        margin-bottom: 3rem !important;
    }
  }
`;

const FixedWrap = styled("div")`
  margin-top: 100px;
`;

const FixedContent = styled("div")`
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
`;

const FixedTarget = styled(FixedContent)`
  bottom: 200px;
  top: -100px;
`;

const NewProducts: FC<{ filterProducts: Product[] }> = ({ filterProducts }) => {
    return (
      <>
        <div className="row">
          <div className="d-lg-none my-5">
            <div className="d-flex flex-column align-items-center text-center">
              <h3 className="title fs-2 mb-3">＼ New Items ／</h3>
              <small className="d-block">
                最新植栽推薦 <br />
                快來挑選你的居家綠色夥伴
              </small>
            </div>
          </div>
          <FixedWrap className="col-md-5 position-relative overflow-hidden d-none d-lg-block">
            <FixedTarget id="fixed-target"></FixedTarget>
            <FixedContent className="d-flex flex-column align-items-center text-center" data-scroll data-scroll-sticky data-scroll-target="#fixed-target">
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
            </FixedContent>
          </FixedWrap>
          <ProductList className="col-md-7" data-scroll data-scroll-delay="0.04" data-scroll-speed="5">
            <ProductCardWrap className="text-center px-4 ps-lg-0 pe-lg-5">
              <div className="row">
                {
                  filterProducts.length
                    ? <>
                      {
                        filterProducts.map(item => {
                          return (
                            <ProductCard item={item} isLink={true} key={item.id}>
                              <small className="d-block mt-3 pt-3 border-top text-start text-dark">
                                <small>{item.description}</small>
                              </small>
                            </ProductCard>
                          )
                        })
                      }
                      </>
                    : ''
                }
              </div>
              <NavLink to="/products" className="btn btn-secondary rounded-pill px-5 mt-4 position-relative">
                所有植栽
                <span className="btn-arrow ms-3 position-absolute">→</span>
              </NavLink>
            </ProductCardWrap>
          </ProductList>
        </div>
      </>
    )
}

export default NewProducts
