
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Pagination = ({ currentPage, totalPages = 0, setCurrentPage }: any) => {
  let pageList = [];
  if (totalPages === 0) {
    pageList = [1];
  } else if (totalPages <= 5) {
    pageList = [...Array(totalPages)].map((_, i) => i + 1);
  } else if (currentPage <= 4) {
    pageList = [1, 2, 3, 4, 5, '...', totalPages];
  } else if (currentPage >= (totalPages - 3)) {
    pageList = [1, '...', ...[...Array(5)].map((_, i) => totalPages - (4 - i))];
  } else {
    pageList = [1, '...', ...[...Array(3)].map((_, i) => currentPage - 1 + i), '...', totalPages];
  }

  return (
    <>
      <nav aria-label="pagination navigation">
				<ul className="pagination align-items-center">
					<li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
						<span className="page-link border-0 page-link-prev" aria-label="Previous" onClick={() => setCurrentPage(currentPage - 1)}>
							<span aria-hidden="true">
                <i className="bi bi-arrow-left-short"></i>
								<span className="d-none d-sm-inline-block ms-1">上一頁</span>
							</span>
						</span>
					</li>
          {
            pageList.map((page, index) => (
              <li key={`page_${index}`} className={`page-item ${currentPage === page ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}>
                <span className="page-link border-0 rounded-3" onClick={() => setCurrentPage(page)}>{page}</span>
              </li>
            ))
          }
					<li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
						<span className="page-link border-0 page-link-next" aria-label="Next" onClick={() => setCurrentPage(currentPage + 1)}>
							<span aria-hidden="true">
								<span className="d-none d-sm-inline-block me-1">下一頁</span>
								<i className="bi bi-arrow-right-short"></i>
							</span>
						</span>
					</li>
				</ul>
			</nav>
    </>
  )
}

export default Pagination;
