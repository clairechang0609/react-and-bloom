import { FC, memo, useCallback } from 'react';
import styled from 'styled-components';
import type { AdminProductListItemProps, Product } from '../../types/product';
import Button from '../Button';
import StatusIcon from '../StatusIcon';

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

const ProductListItem: FC<AdminProductListItemProps> = memo(({ showModal, product, setSelectedProduct, showAlertModal }) => {
  const { title, price, origin_price, is_enabled, category } = product;

  const editForm = useCallback((product: Product) => {
    setSelectedProduct(product);
    showModal();
  }, [showModal, setSelectedProduct]);

  const deleteProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
    showAlertModal();
  }, [showAlertModal, setSelectedProduct]);

  return (
    <ProductItem className="card mb-3">
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
          <div className="col-md d-flex justify-content-center align-items-center">
            <p className="mb-0 me-2">$ {price}</p>
            <small className="text-muted text-decoration-line-through">$ {origin_price}</small>
          </div>
          <div className="col-md d-flex justify-content-center">
            <StatusIcon isEnabled={is_enabled} />
          </div>
          <div className="col-md d-flex align-items-center justify-content-end">
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
