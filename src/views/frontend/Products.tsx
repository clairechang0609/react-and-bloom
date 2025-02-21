import 'bootstrap';
import { useState } from 'react';
import ProductListItem from '../../components/frontend/ProductListItem';
import Pagination from '../../components/Pagination';
import useGetProducts from '../../hooks/frontend/useGetProducts';

const Products = () => {
  const [category, setCategory] = useState('');
  const { products, currentPage, setCurrentPage, totalPages } = useGetProducts({ category });

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom">
        <h4 className="mb-0">產品列表</h4>
        <select name="category" id="category" className="form-select form-select-sm w-auto" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">所有商品</option>
          <option value="大型植栽">大型植栽</option>
          <option value="觀花植物">觀花植物</option>
          <option value="觀葉植物">觀葉植物</option>
          <option value="多肉植物">多肉植物</option>
        </select>
      </div>
      <div className="row row-cols-1 row-cols-md-2">
          {products.map((item) => (
            <div className="mb-4" key={item.id}>
              <ProductListItem product={item} />
            </div>
          ))}
      </div>
      <div className="d-flex justify-content-center my-5">
        <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  )
}

export default Products;
