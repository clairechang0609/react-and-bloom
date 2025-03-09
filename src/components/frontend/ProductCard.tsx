import { FC, ReactNode } from "react";
import { NavLink } from "react-router";
import styled from "styled-components";
import { Product } from "../../types/product";

const CardWrap = styled("div")`
  .card {
    height: 100%;
    border-radius: 20px;
    border-color: rgba(0, 0, 0, 0.3);
    background-color: white;
    overflow: hidden;
    box-shadow: 5px 5px rgba(136, 138, 140, 0.3);

    &:hover {
      background-color: #f8f9fa;
      z-index: 1000;
    }

    &:hover {
      .sub {
        opacity: 1;
      }
      .main {
        opacity: 0;
      }
    }
  }

  .main {
    opacity: 1;
    transition: opacity 0.3s ease-in;
  }

  .sub {
    opacity: 0;
    transition: opacity 0.3s ease-in;
    position: absolute;
    left: 0;
  }

  &.bg-none {
    .card {
      border-radius: 0;
      border: none;
      border-bottom: 1px solid rgba(0, 0, 0, 0.3);
      background-color: transparent;
      box-shadow: none;
      padding-bottom: 20px !important;

      &:hover {
        background-color: transparent;
      }
    }
  }
`;

const ImageWrap = styled("div")`
  position: relative;
  width: 30%;
  display: flex;
  align-items: stretch;
  overflow: hidden;

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;

const CardBody: FC<{ item: Product; children: ReactNode; isVerical: boolean; hasBg: boolean }> = ({ item, children, isVerical, hasBg }) => {
  const { category, title, price, origin_price, imageUrl, imagesUrl } = item;

  return (
    <div className={`card-body p-0 d-flex align-items-stretch ${isVerical ? 'flex-column' : 'flex-row'}`}>
      <ImageWrap className={`flex-shrink-0 ${isVerical ? 'w-100 ratio ratio-1x1' : ''}`}>
        <img src={imageUrl} alt={`${title} image`} className="main" />
        <img src={imagesUrl[0]} alt={`${title} image`} className="sub" />
      </ImageWrap>
      <div className={`d-flex flex-column align-items-start flex-fill ${hasBg ? 'p-4' : 'px-4 pt-1'}`}>
        <span className="badge rounded-pill bg-primary fs-sm mb-2">{category}</span>
        <h5 className="mb-3 fw-light">{title}</h5>
        <div className="d-flex align-items-center">
          <h5 className="text-danger mb-0 me-3">$ {price}</h5>
          <small className="text-muted text-decoration-line-through">$ {origin_price}</small>
        </div>
        {children}
      </div>
    </div>
  )
}

const ProductCard: FC<{ item: Product; children?: ReactNode; isLink?: boolean; isVerical?: boolean; hasBg?: boolean }> = ({ item, children, isLink = false, isVerical = false, hasBg = true }) => {
  const { id } = item;

  return (
    <CardWrap className={`product-card mb-4 ${!hasBg && 'bg-none'}`} key={id}>
      {
        isLink
          ? <NavLink to={`/product/${id}`} className="card">
              <CardBody item={item} children={children} isVerical={isVerical} hasBg={hasBg} />
            </NavLink>
          : <div className="card">
              <CardBody item={item} children={children} isVerical={isVerical} hasBg={hasBg} />
            </div>
      }
    </CardWrap>
  );
}


export default ProductCard;
