import { useMemo } from "react";
import useGetArticles from "../../hooks/frontend/useGetArticles";


const Articles = () => {
  const { articles } = useGetArticles();

  return (
    <>Articles</>
  )
}

export default Articles;
