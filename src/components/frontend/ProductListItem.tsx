import { FC, memo } from 'react';
import { NavLink } from 'react-router';
import styled from 'styled-components';
import { asyncAddCart } from '../../slice/cartSlice';
import { useAppDispatch } from "../../store";
import type { Product } from '../../types/product';
import Button from '../Button';

const ImageContainer = styled.div`
  width: 80px;
  height: 80px;
`;

const ProductItem = styled("li")`
  border-radius: 20px;
  background-color: white;
  box-shadow: 5px 5px #dfe2e6;

  &:hover {
    background-color: #f8f9fa;
    z-index: 1000;
    border-color: rgba(0, 0, 0, 0.3);
  }
`;

// 產品項目
const ProductListItem: FC<{ product: Product }> = memo(({ product }) => {
  const dispatch = useAppDispatch();
  const { id, title, price, origin_price, category } = product;

  return (
    <ProductItem className="product-list-item card mb-3">
      <div className="card-body">
        <div className="row w-100 justify-content-between align-items-center">
          <div className="col-auto">
            <ImageContainer className="image-container rounded-circle overflow-hidden border">
              <img src={product.imageUrl} alt={title} className="w-100 h-100 object-fit-cover" />
            </ImageContainer>
          </div>
          <div className="col-md-4">
            <span className="badge rounded-pill bg-primary fs-sm mb-2">{category}</span>
            <h6 className="mt-1 mb-2">{title}</h6>
          </div>
          <div className="col-auto">
            <p className="mb-0 me-2">$ {price}</p>
            <small className="text-muted text-decoration-line-through">$ {origin_price}</small>
          </div>
          <div className="col-auto d-flex flex-column align-items-stretch justify-content-end">
            <NavLink to={`/product/${id}`} className="btn btn-sm btn-outline-primary rounded-pill mb-2">查看更多</NavLink>
            <Button btnStyle="btn-sm btn-secondary" handleClick={() => dispatch(asyncAddCart({ productId: id })) }>加入購物車</Button>
          </div>
        </div>
      </div>
    </ProductItem>
  )
});

export default ProductListItem;
