import { FC, ReactNode } from "react";
import { NavLink } from "react-router";
import styled from "styled-components";
import { Product } from "../../types/product";

const Card = styled("div")`
  .card {
    height: 100%;
    border-radius: 0;
    border: none;
    background-color: white;
    box-shadow: 10px 10px 15px rgb(117, 119, 121, 0.3);

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
  }
`;

const ImageWrap = styled("div")`
  position: relative;
  width: 30%;
  display: block;
  aspect-ratio: 1 / 1;
  overflow: hidden;

  img {
    position: absolute;
    left: 0;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
}
`;

const ProductCard: FC<{ item: Product; children?: ReactNode }> = ({ item, children }) => {
  const { id, category, title, price, origin_price, imageUrl, imagesUrl } = item;

  return (
    <Card className="product-card col mb-4 mb-md-0" key={id}>
      <NavLink to={`/product/${id}`} className="card">
        <div className="card-body p-0 d-flex align-items-center">
          <ImageWrap className="image-wrap flex-shrink-0">
            <img src={imageUrl} alt={`${title} image`} className="main" />
            <img src={imagesUrl[0]} alt={`${title} image`} className="sub" />
          </ImageWrap>
          <div className="d-flex flex-column align-items-start flex-fill p-4">
            <span className="badge rounded-pill bg-primary fs-sm mb-2">{category}</span>
            <h5 className="mb-3 fs-4 fw-light">{title}</h5>
            <div className="d-flex align-items-center">
              <h5 className="text-danger mb-0 me-3">$ {price}</h5>
              <small className="text-muted text-decoration-line-through">$ {origin_price}</small>
            </div>
            {children}
          </div>
        </div>
      </NavLink>
    </Card>
  )
}

export default ProductCard;
