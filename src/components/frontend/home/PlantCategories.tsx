import { FC } from "react";
import { NavLink } from "react-router";
import styled from "styled-components";
import { CategoryCardProps } from "../../../types/home";

const CategoryCardStyle = styled("div")`
  transition: 0.5s cubic-bezier(0,.85,.45,1) 0.5s;
  transform: translateY(100%);
  opacity: 0;

  &.is-inview {
    transform: translateY(0);
    opacity: 1;
  }
`;

const ImageWrap = styled("div")`
  overflow: hidden;
  flex-shrink: 0;

  .image-outer {
    aspect-ratio: 3 / 4;
    overflow: hidden;
    will-change: transform, opacity;

    &.is-inview {
      img {
        opacity: 1;
        transform: scale(1);
      }
    }
  }

  img {
    width: 100%;
    opacity: 0;
    transform: scale(1.5);
    transform-origin: center;
    transition: opacity 1.2s cubic-bezier(.215,.61,.355,1), transform 1.2s cubic-bezier(.215,.61,.355,1);
  }
`;

const categories = [
  {
    icon: "./icon-03.svg",
    title: "觀花植物",
    description: "鮮豔花朵點綴空間，營造溫馨氛圍",
    plants: [
      {
        name: "火鶴花",
        id: "-OFw3pnPKDo3lBndVBjm"
      },
      {
        name: "櫻花苔玉",
        id: "-OG9J1VVDk-sqPl9qMdY"
      }
    ]
  },
  {
    icon: "./icon-02.svg",
    title: "多肉植物",
    description: "迷你療癒系，輕鬆好養不費心",
    plants: [
      {
        name: '沙漠玫瑰',
        id: '-OG9FnB6iQqIoqAhZiVb'
      },
      {
        name: '香葉草',
        id: '-OKyt5dKRrMbX_vhHIOn'
      }
    ]
  },
  {
    icon: "./icon-04.svg",
    title: "大型植栽",
    description: "打造空間綠意焦點，提升生活質感",
    plants: [
      {
        name: "旅人蕉",
        id: "-OG9KxW4iGCfQys4TP6W"
      },
      {
        name: "龜背芋",
        id: "-OFvzAWoPIh6KN0cWBbT"
      }
    ]
  },
  {
    icon: "./icon-01.svg",
    title: "觀葉植物",
    description: "綠意盎然，輕鬆打造療癒空間",
    plants: [
      {
        name: "黑葉金錢樹",
        id: "-OG9HPsocFyozZZ3sRJl"
      },
      {
        name: "小葉欖仁",
        id: "-OG9B2gF0BH99VU5gpya"
      }
    ]
  }
];

const CategoryCard: FC<CategoryCardProps> = ({ icon, title, description, plants }) => {
  return (
    <CategoryCardStyle className="py-5" data-scroll>
      <img src={icon} alt={title} className="text-light mb-4" style={{ maxHeight: '50px', maxWidth: '50px' }} />
      <h6 className="fs-4 fw-light text-tertiary">{title}</h6>
      <div className="mx-auto my-3" style={{ width: '1px', height: '35px', backgroundColor: 'var(--gray)' }}></div>
      <p className="text-gray">{description}</p>
      <small>
        推薦植栽：
        {
          plants.map((plant, key) => {
            return (
              <span key={`plant-${plant.id}`}>
                <NavLink to={`/product/${plant.id}`} className="text-white border-bottom border-white">{plant.name}</NavLink>
                {key !== plants.length - 1 ? '、' : ''}
              </span>
            )
          })
        }
      </small>
    </CategoryCardStyle>
  )
};

const PlantCategories = () => {
  return (
    <div className="text-white row align-items-center bg-secondary px-4" style={{ padding: '5rem 0' }}>
      <div className="col-12 text-center mb-5">
        <h3 className="title fs-2 mb-3">＼ Plant Categories ／</h3>
        <small className="d-block">
          探索不同植栽風格 <br />
          為空間增添獨特氛圍
        </small>
      </div>
      <div className="col-md-4 d-flex flex-column align-items-center text-center">
        {
          categories.slice(0, 2).map(category => {
            return (
              <CategoryCard key={`category-${category.title}`} {...category} />
            )
          })
        }
      </div>
      <div className="col-md-4 d-none d-md-block">
        <ImageWrap className="w-100">
          <div className="image-outer" data-scroll data-scroll-speed="3">
            <img src="./plant-08.jpg" alt="plant-08" />
          </div>
        </ImageWrap>
      </div>
      <div className="col-md-4 d-flex flex-column align-items-center text-center">
        {
          categories.slice(2).map(category => {
            return (
              <CategoryCard key={`category-${category.title}`} {...category} />
            )
          })
        }
      </div>
    </div>
  )
}

export default PlantCategories;
