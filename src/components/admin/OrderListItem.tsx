import { FC, memo, useCallback } from 'react';
import styled from 'styled-components';
import type { AdminOrderListItemProps, Order } from '../../types/order';
import Button from '../Button';
import StatusIcon from '../StatusIcon';

const OrderItem = styled("li")`
  margin-top: -1px;
  &:hover {
    background-color: #f8f9fa;
    z-index: 1000;
    border-color: rgba(0, 0, 0, 0.3);
  }
`;

const OrderListItem: FC<AdminOrderListItemProps> = memo(({ showModal, order, setSelectedOrder, showAlertModal }) => {
  const { id, user, products, total, is_paid, message } = order;

  const editForm = useCallback((order: Order) => {
    setSelectedOrder(order);
    showModal();
  }, [showModal, setSelectedOrder]);

  const deleteOrder = useCallback((order: Order) => {
    setSelectedOrder(order);
    showAlertModal();
  }, [showAlertModal, setSelectedOrder]);

  return (
    <OrderItem className="card mb-3">
      <div className="card-body">
        <div className="row w-100 justify-content-between align-items-center">
          <div className="col-md">
            <p className="mb-0 ms-4">{user.name}</p>
          </div>
          <div className="col-md-4">
            <span className="badge rounded-pill bg-primary fs-sm mb-1">訂購品項</span>
            {
              Object.values(products).map((item, index) => {
                return (
                  <small className={`d-flex py-1 my-1 border-bottom ${index === 0 && 'border-top'}`} key={`${id}-${item.id}`}>
                    {item.product.title} * {item.qty}
                    <span className="ms-auto">${item.final_total}</span>
                  </small>
                )
              })
            }
            <small className="fw-bold d-flex pb-1 mb-1 border-bottom">
              總金額
              <span className="ms-auto">${total}</span>
            </small>
          </div>
          <div className="col-md d-flex justify-content-center">
            <StatusIcon isEnabled={is_paid} labels={['未付款', '已付款']} />
          </div>
          <div className="col-md d-flex align-items-center justify-content-end">
            <Button btnStyle="btn-sm btn-secondary" handleClick={() => editForm(order)}>編輯</Button>
            <Button btnStyle="btn-sm btn-outline-primary ms-2" handleClick={() => deleteOrder(order)}>
              刪除
            </Button>
          </div>
        </div>
      </div>
    </OrderItem>
  )
});

export default OrderListItem;
