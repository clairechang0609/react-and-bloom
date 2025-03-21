import 'bootstrap';
import { useState } from 'react';
import { NavLink } from 'react-router';
import Button from '../../components/Button';
import ProductCard from '../../components/frontend/ProductCard';
import Pagination from '../../components/Pagination';
import useGetProducts from '../../hooks/frontend/useGetProducts';
import { asyncAddCart } from '../../slice/cartSlice';
import { useAppDispatch } from '../../store';

const Products = () => {
  const dispatch = useAppDispatch();
  const [category, setCategory] = useState('');
  const { products, currentPage, setCurrentPage, totalPages } = useGetProducts({ category });

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center pb-3 mb-5 border-bottom">
        <div className="d-flex align-items-center">
          <h3 className="title fs-2 mb-0 me-3">All Plants</h3>
          <small className="mt-2">產｜品｜列｜表</small>
        </div>
        <select name="category" id="category" className="form-select form-select-sm w-auto" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">所有商品</option>
          <option value="大型植栽">大型植栽</option>
          <option value="觀花植物">觀花植物</option>
          <option value="觀葉植物">觀葉植物</option>
          <option value="多肉植物">多肉植物</option>
        </select>
      </div>
      <div className="row row-cols-1 row-cols-md-2 gx-4">
        {products.map((item) => (
            <ProductCard item={item} key={item.id} hasBg={false}>
              <div className="w-100 d-flex flex-column flex-sm-row align-items-sm-center justify-content-end pt-4 mt-auto">
                <NavLink to={`/product/${item.id}`} className="btn btn-sm btn-outline-primary rounded-pill mb-2 mb-sm-0 me-sm-2 px-4">查看更多</NavLink>
                <Button btnStyle="btn-sm btn-secondary" handleClick={() => dispatch(asyncAddCart({ productId: item.id })) }>加入購物車</Button>
              </div>
            </ProductCard>
        ))}
      </div>
      <div className="d-flex justify-content-center my-5">
        <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  )
}

export default Products;
