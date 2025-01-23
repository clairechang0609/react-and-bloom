import { FC, memo, useCallback } from 'react';
import StatusIcon from './StatusIcon';
import Button from './Button';
import type { Product, ProductListItemProps } from '../types/product';
import styled from 'styled-components';

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
const ProductListItem: FC<ProductListItemProps> = memo(({ product, modal, setSelectedProduct, alertModal }) => {
  const { id, title, price, origin_price, is_enabled, category } = product;

  const editForm = useCallback((product: Product) => {
    setSelectedProduct(product);
    modal.current?.show();
  }, [modal, setSelectedProduct]);

  const deleteProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
    alertModal.current?.show();
  }, [alertModal, setSelectedProduct]);

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
          <div className="col-auto">
            <StatusIcon isEnabled={is_enabled} />
          </div>
          <div className="col-auto d-flex align-items-center justify-content-end">
            <Button btnStyle="btn-sm btn-secondary" handleClick={() => editForm(product)}>編輯</Button>
            <Button btnStyle="btn-sm btn-outline-primary ms-2" handleClick={() => deleteProduct(product)}>
              刪除
            </Button>
          </div>
        </div>
      </div>
    </ProductItem>
  )
});

export default ProductListItem;
