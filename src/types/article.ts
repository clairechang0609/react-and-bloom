export interface Article {
  author: string;
  create_at: number;
  description: string;
  id: string;
  image: string;
  isPublic: boolean;
  tag: string[];
  title: string;
  content?: string;
}

export interface AdminArticleListItemProps {
  showModal: () => void;
  article: Article;
  showAlertModal: () => void;
  setSelectedArticle: (value: Article | null) => void;
}

export interface AdminArticleModalProps {
  selectedArticle: Article | null;
  getList: () => void;
}
