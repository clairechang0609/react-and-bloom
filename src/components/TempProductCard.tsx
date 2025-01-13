import { FC } from 'react';
import type { Product } from '../types/product';


// 產品介紹卡片
const TempProductCard: FC<{ tempProduct: Product | null }> = ({ tempProduct }) => {
  return <>
    {tempProduct ? (
      <div className="card mb-3">
        <div className="card-body">
          <div className="row">
            <div className="col-lg-5 mb-3 mb-lg-0">
              <div className="carousel slide" id="carousel">
                <div className="carousel-inner">
                  <div className="carousel-item active bg-black">
                    <img src={tempProduct.imageUrl} className="w-100 object-fit-cover mask-img" alt="主圖" />
                  </div>
                  {tempProduct.imagesUrl.map((item, index) => {
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
            <div className="col-lg-7">
              <span className="badge rounded-pill bg-primary fs-sm mb-2">{tempProduct.category}</span>
              <h5 className="border-bottom pb-2 mb-3">{tempProduct.title}</h5>
              <p className="card-text">
                <small className="fw-bold d-block">商品描述：</small>
                {tempProduct.description}
              </p>
              <p className="card-text">
              <small className="fw-bold d-block">注意事項：</small>
                {tempProduct.content}
              </p>
              <div className="d-flex align-items-center">
                <h4 className="mb-0 me-2 text-danger">$ {tempProduct.price}</h4>
                <small className="text-muted text-decoration-line-through">$ {tempProduct.origin_price}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <p>點擊商品查看介紹</p>
    )}
  </>
}

export default TempProductCard;
