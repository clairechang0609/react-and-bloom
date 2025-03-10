import { FC, memo, useCallback } from 'react';
import styled from 'styled-components';
import { AdminArticleListItemProps, Article } from '../../types/article';
import Button from '../Button';
import StatusIcon from '../StatusIcon';

const ListItem = styled("li")`
  margin-top: -1px;

  &:hover {
    background-color: #f8f9fa;
    z-index: 1000;
    border-color: rgba(0, 0, 0, 0.3);
  }
`;

const ProductListItem: FC<AdminArticleListItemProps> = memo(({ showModal, article, setSelectedArticle, showAlertModal }) => {
  const { author, image, isPublic, tag, title } = article;

  const editForm = useCallback((article: Article) => {
    setSelectedArticle(article);
    showModal();
  }, [showModal, setSelectedArticle]);

  const deleteArticle = useCallback((article: Article) => {
    setSelectedArticle(article);
    showAlertModal();
  }, [showAlertModal, setSelectedArticle]);

  return (
    <ListItem className="card mb-3">
      <div className="card-body">
        <div className="row w-100 justify-content-between align-items-center">
          <div className="col-auto">
            <div className="image-container rounded-circle overflow-hidden border" style={{ width: '80px', height: '80px' }}>
              <img src={image} alt={title} className="w-100 h-100 object-fit-cover" />
            </div>
          </div>
          <div className="col-md">
            <h6 className="mb-0">{title}</h6>
          </div>
          <div className="col-md">
            <span className="badge rounded-pill bg-primary fs-sm mb-1">作者</span>
            <p className="mb-0">{author}</p>
          </div>
          <div className="col-md">
            <span className="badge rounded-pill bg-primary fs-sm mb-1">標籤</span>
            <p className="mb-0">{tag.join(', ')}</p>
          </div>
          <div className="col-md d-flex justify-content-center">
            <StatusIcon isEnabled={isPublic} labels={['隱藏', '公開']} />
          </div>
          <div className="col-md d-flex align-items-center justify-content-end">
            <Button btnStyle="btn-sm btn-secondary" handleClick={() => editForm(article)}>編輯</Button>
            <Button btnStyle="btn-sm btn-outline-primary ms-2" handleClick={() => deleteArticle(article)}>
              刪除
            </Button>
          </div>
        </div>
      </div>
    </ListItem>
  )
});

export default ProductListItem;
