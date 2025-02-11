import { FC, memo, useCallback } from 'react';
import { NavLink } from 'react-router';
import styled from 'styled-components';
import type { Product, ProductListItemProps } from '../../types/product';
import Button from '../Button';

const ImageContainer = styled.div`
  width: 80px;
  height: 80px;
`;

const ProductItem = styled("li")`
  margin-top: -1px;
  &:hover {
    background-color: #f8f9fa;
    z-index: 1000;
    border-color: rgba(0, 0, 0, 0.3);
  }
`;

// 產品項目
const ProductListItem: FC<ProductListItemProps> = memo(({ showModal, product, setSelectedProduct, addCart }) => {
  const { id, title, price, origin_price, category } = product;

  const handleSeeMore = useCallback((product: Product) => {
    setSelectedProduct(product);
    showModal();
  }, [showModal, setSelectedProduct]);

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
            <Button btnStyle="btn-sm btn-outline-primary mb-2" handleClick={() => handleSeeMore(product)}>
              查看更多
            </Button>
            <NavLink to={`/product/${id}`} className="btn btn-sm btn-outline-primary rounded-pill mb-2">查看更多</NavLink>
            <Button btnStyle="btn-sm btn-secondary" handleClick={() => addCart(id)}>加入購物車</Button>
          </div>
        </div>
      </div>
    </ProductItem>
  )
});

export default ProductListItem;
