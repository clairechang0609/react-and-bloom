import { FC, memo } from 'react';
import { NavLink } from 'react-router';
import styled from 'styled-components';
import { asyncAddCart } from '../../slice/cartSlice';
import { useAppDispatch } from "../../store";
import type { Product } from '../../types/product';
import Button from '../Button';

const ImageContainer = styled.div`
  border-radius: 20px 0 0 20px;
  overflow: hidden;
  height: 100%;
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
    <ProductItem className="product-list-item card">
      <div className="row g-0">
        <div className="col-4">
          <ImageContainer>
            <img src={product.imageUrl} alt={title} className="w-100 h-100 object-fit-cover" />
          </ImageContainer>
        </div>
        <div className="col-8">
          <div className="card-body d-flex flex-column align-items-start h-100">
              <span className="badge rounded-pill bg-primary fs-sm mb-2">{category}</span>
              <h4 className="mt-1 mb-3 fs-6">{title}</h4>
              <div className="d-flex align-items-center mb-3">
                <h5 className="mb-0 me-3 text-danger fs-4">$ {price}</h5>
                <small className="text-muted text-decoration-line-through">$ {origin_price}</small>
              </div>
              <div className="w-100 d-flex align-items-center justify-content-end mt-auto">
                <NavLink to={`/product/${id}`} className="btn btn-sm btn-outline-primary rounded-pill me-2 px-4">查看更多</NavLink>
                <Button btnStyle="btn-sm btn-secondary" handleClick={() => dispatch(asyncAddCart({ productId: id })) }>加入購物車</Button>
              </div>
          </div>
        </div>
      </div>
    </ProductItem>
  )
});

export default ProductListItem;
