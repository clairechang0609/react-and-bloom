import { FC } from "react";
import { NavLink } from "react-router";
import styled from "styled-components";
import { Product } from "../../types/product";

const Card = styled("div")`
  .card {
    height: 100%;
    border-radius: 20px;
    border: 1px solid black;
    background-color: white;
    box-shadow: 5px 5px black;

    &:hover {
      .sub {
        transform: scaleX(1);
      }
      .main {
        display: none;
        opacity: 0;
      }
    }
  }

  .sub {
    transform: scaleX(0);
  }
`;

const ImageWrap = styled("div")`
  width: 30%;
  display: block;
  aspect-ratio: 1 / 1;
  border-radius: 1rem;
  overflow: hidden;

	img {
		object-fit: cover;
    width: 100%;
    height: 100%;
    transition: 0.3s ease;
	}
}
`;

const ProductCard: FC<{ item: Product }> = ({ item }) => {
  const { id, category, title, price, origin_price, imageUrl, imagesUrl } = item;

  return (
    <Card className="col mb-4 mb-md-0" key={id}>
      <NavLink to={`/product/${id}`} className="card">
        <div className="card-body d-flex align-items-center">
          <ImageWrap>
            <img src={imageUrl} alt={`${title} image`} className="main" />
            <img src={imagesUrl[0]} alt={`${title} image`} className="sub" />
          </ImageWrap>
          <div className="d-flex flex-column align-items-center flex-fill">
            <span className="badge rounded-pill bg-primary fs-sm mb-2">{category}</span>
            <h6 className="mt-1 mb-2">{title}</h6>
            <div className="d-flex align-items-center">
              <p className="text-secondary mb-0 me-2">$ {price}</p>
              <small className="text-muted text-decoration-line-through">$ {origin_price}</small>
            </div>
          </div>
        </div>
      </NavLink>
    </Card>
  )
}

export default ProductCard;
