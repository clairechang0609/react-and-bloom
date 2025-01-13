import { FC } from 'react';
import StatusIcon from './StatusIcon';
import type { ProductListItemProps } from '../types/product';

// 產品項目
const ProductListItem: FC<ProductListItemProps> = ({ product, setTempProduct }) => {
  const { title, price, origin_price, is_enabled } = product;
  return (
    <li className="product-list-item card mb-2" onClick={() => setTempProduct(product)}>
      <div className="card-body d-flex justify-content-between">
        <div>
          <h6 className="mt-1 mb-2">{title}</h6>
          <div className="d-flex align-items-center">
            <p className="mb-0 me-2">$ {price}</p>
            <small className="text-muted text-decoration-line-through">$ {origin_price}</small>
          </div>
        </div>
        <div>
          <StatusIcon isEnabled={is_enabled} />
        </div>
      </div>
    </li>
  )
}

export default ProductListItem;
