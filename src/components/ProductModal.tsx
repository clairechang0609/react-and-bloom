import { useEffect, FC, ChangeEvent, useState, memo, useCallback } from 'react';
import type { ProductModalProps } from '../types/product';
import Button from './Button';

const ProductModal: FC<ProductModalProps> = memo(({ modalRef, selectedProduct }) => {
  return (
    <div className="modal fade" data-bs-backdrop="static" tabIndex={-1} ref={modalRef}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title fs-5">{selectedProduct?.title}</h2>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-lg-5 mb-3 mb-lg-0">
                <div className="carousel slide" id="carousel">
                  <div className="carousel-inner">
                    <div className="carousel-item active bg-black">
                      <img src={selectedProduct?.imageUrl} className="w-100 object-fit-cover mask-img" alt="主圖" />
                    </div>
                    {selectedProduct?.imagesUrl.map((item, index) => {
                      return <div className="carousel-item bg-black" key={index}>
                        <img src={item} alt="附圖" className="d-block w-100 object-fit-cover mask-img" />
                      </div>
                    })}
                  </div>
                  <button className="carousel-control-prev align-items-end pb-2" type="button" data-bs-target="#carousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button className="carousel-control-next align-items-end pb-2" type="button" data-bs-target="#carousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
              </div>
              <div className="col-lg-7 d-flex flex-column">
                <span className="badge rounded-pill bg-primary fs-sm mb-2 align-self-start">{selectedProduct?.category}</span>
                <h5 className="border-bottom pb-2 mb-3">{selectedProduct?.title}</h5>
                <p className="card-text">
                  <small className="fw-bold d-block">商品描述：</small>
                  {selectedProduct?.description}
                </p>
                <p className="card-text">
                <small className="fw-bold d-block">注意事項：</small>
                  {selectedProduct?.content}
                </p>
                <div className="d-flex align-items-center">
                  <h4 className="mb-0 me-2 text-danger">$ {selectedProduct?.price}</h4>
                  <small className="text-muted text-decoration-line-through">$ {selectedProduct?.origin_price}</small>
                </div>
                <div className="mt-auto">
                  <label htmlFor="quantity" className="form-label d-block mb-1">數量</label>
                  <div className="d-flex align-items-center">
                    <input type="number" className="form-control" id="quantity" defaultValue="1" min="1" />
                    <Button type="submit" btnStyle="btn btn-secondary flex-shrink-0 ms-2">加入購物車</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
});

export default ProductModal;
