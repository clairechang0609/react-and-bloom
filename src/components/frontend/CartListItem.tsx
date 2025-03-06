import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { FC } from "react";
import { NavLink } from "react-router";
import styled from 'styled-components';
import { asyncGetCart } from "../../slice/cartSlice";
import { setIsFullPageLoading } from "../../slice/loadingSlice";
import { useAppDispatch } from "../../store";
import type { CartItem } from "../../types/cart";
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const ImageContainer = styled.div`
  width: 50px;
  height: 50px;
`;

const CartListItem: FC<{ item: CartItem }> = ({ item }) => {
  const dispatch = useAppDispatch();
  const { id, qty, total, product } = item;

  const editQty = async (id: string, qty: number, productId?: string) => {
    try {
      dispatch(setIsFullPageLoading(true));
      await axios[qty ? 'put' : 'delete'](`${VITE_API_BASE}/api/${VITE_API_PATH}/cart/${id}`, (qty && {
        data: {
          product_id: productId,
          qty
        }
      }) as AxiosRequestConfig | undefined);
      await dispatch(asyncGetCart());
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err?.response?.data.message);
      }
    } finally {
      dispatch(setIsFullPageLoading(false));
    }
  }

  const toPositiveInteger = (value: string) => {
    const result = value.replace(/[^0-9]+/g, '');
    return result && parseInt(result) ? parseInt(result) : 1;
  }

  return (<>
    <div className="list-group-item border-0 border-bottom rounded-0 p-4">
      <div className="d-flex">
        <ImageContainer className="image-container rounded-circle overflow-hidden border me-3">
          <img src={product.imageUrl} alt={product.title} className="w-100 h-100 object-fit-cover" />
        </ImageContainer>
        <div className="flex-grow-1 flex-shrink-0 ">
          <div className="d-flex justify-content-between">
            <NavLink to={`/product/${product?.id}`}>
              <h6 className="mb-2">{product.title}</h6>
            </NavLink>
            <i className="bi bi-x-lg opacity-75 cursor-pointer" onClick={() => editQty(id, 0, product.id)} />
          </div>
          <p className="mb-0 d-flex align-items-center text-muted">
            <span className="badge rounded-pill text-bg-info me-2">單價</span>
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
