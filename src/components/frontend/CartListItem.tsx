import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { FC } from "react";
import styled from 'styled-components';
import type { CartListItemProp } from "../../types/cart";
import { NavLink } from "react-router";
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const ImageContainer = styled.div`
  width: 50px;
  height: 50px;
`;

const CartListItem: FC<CartListItemProp> = ({ item, setIsFullPageLoading, getCart }) => {
  const { id, qty, total, product } = item;

  const editQty = async (id: string, qty: number, productId?: string) => {
    try {
      setIsFullPageLoading(true);

      await axios[qty ? 'put' : 'delete'](`${VITE_API_BASE}/api/${VITE_API_PATH}/cart/${id}`, (qty && {
        data: {
          product_id: productId,
          qty
        }
      }) as AxiosRequestConfig | undefined);
      getCart();
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err?.response?.data.message);
      }
    } finally {
      setIsFullPageLoading(false);
    }
  }

  const toPositiveInteger = (value: string) => {
    const result = value.replace(/[^0-9]+/g, '');
    return result && parseInt(result) ? parseInt(result) : 1;
  }

  return (<>
    <div className="list-group-item p-3">
      <div className="d-flex">
        <ImageContainer className="image-container rounded-circle overflow-hidden border me-3">
          <img src={product.imageUrl} alt={product.title} className="w-100 h-100 object-fit-cover" />
        </ImageContainer>
        <div className="flex-grow-1 flex-shrink-0 ">
          <div className="d-flex justify-content-between">
            <NavLink to={`/product/${product?.id}`} className="text-secondary">
              <h6 className="mb-2">{product.title}</h6>
            </NavLink>
            <i className="bi bi-x-lg opacity-75 cursor-pointer" onClick={() => editQty(id, 0, product.id)} />
          </div>
          <p className="mb-0 d-flex align-items-center text-muted">
            <span className="badge rounded-pill text-bg-light me-2">單價</span>
            <span>${product.price}</span>
          </p>
          <div className="d-flex align-items-center mt-2">
            <i className={`bi bi-dash-square-fill fs-3 ${qty === 1 ? 'cursor-default opacity-50' : 'cursor-pointer'}`} onClick={() => qty > 1 && editQty(id, qty - 1, product.id)} />
            <input type="number" className="form-control form-control-sm mx-2" value={qty} onChange={(e) => editQty(id, toPositiveInteger(e.target.value), product.id)} />
            <i className="bi bi-plus-square-fill fs-3 cursor-pointer" onClick={() => editQty(id, qty + 1, product.id)} />
          </div>
        </div>
      </div>
    </div>
  </>)
}

export default CartListItem;
