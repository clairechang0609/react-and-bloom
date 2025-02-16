import axios, { AxiosError } from 'axios';
import 'bootstrap';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import styled, { createGlobalStyle } from 'styled-components';
import '../../assets/home.scss';
import { Product } from '../../types/product';
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const Global = createGlobalStyle`
  html {
    scroll-snap-type: y mandatory;
    timeline-scope: --section;
  }

  h2 {
    line-height: 1;
    font-weight: 300;
    font-size: calc(7vw + 1rem);
    font-family: 'Cormorant Garamond', Didot, 'Bodoni MT', 'Noto Serif Display', 'URW Palladio L', P052, Sylfaen, serif;

    @media screen and (min-width: 1000px) {
      font-size: 100px;
    }
  }
`;

const Banner = styled("div")`
  background-image: url('./banner-01.jpg');
  background-position: center;
  background-size: cover;
  background-color: #dfdbcf;
  height: 100vh;
  font-size: 100px;

  @supports (animation-timeline: scroll()) {
    position: fixed;
    top: 0;
    width: 100%;
    animation: stickyAnimation linear both;
    animation-duration: 1ms;
    animation-direction: alternate;
    animation-timeline: scroll(block nearest);
    animation-range: 0vh 100vh;
  }

  @keyframes stickyAnimation {
    0% {
      height: 100vh;
      font-size: 100px;
    }
    50% {
      font-size: 0;
    }
    100% {
      height: 70px;
      opacity: 0;
      font-size: 0;
      visibility: hidden;
    }
  }
`;

const Title = styled("div")`
  color: white;
  text-shadow: 0 0 0.75rem rgba(0, 0, 0, 0.75);

  h2 {
    font-size: 1em;
  }

  p {
    font-size: 0.15em;
  }
`;

const IntroContainer = styled("div")`
  margin-top: 3rem;
  @supports (animation-timeline: scroll()) {
    margin-top: calc(110vh);
  }
  view-timeline: --section;
`;

const Intro = styled("div")`
  animation-name: scaleAnimation;
  animation-duration: 1ms; /* Firefox requires this to apply the animation */
  animation-direction: alternate;
  animation-timeline: --section;
  animation-range: entry 0% 50%;
  max-width: 100%;
  width: 1000px;
  margin-left: auto;
  margin-right: auto;

  @keyframes scaleAnimation {
    from {
      opacity: 0;
      transform: scaleX(0);
    }
    to {
      opacity: 1;
      transform: scaleX(100%);
    }
  }

  strong {
    color:rgb(37, 106, 76);
  }

  > img {
    width: 40vw;

    @media screen and (min-width: 1000px) {
      width: 400px;
    }
  }
}
`;

const Card = styled("div")`
  .card {
    height: 100%;
    border-radius: 20px;
    border: 1px solid black;
    background-color: white;
    box-shadow: 5px 5px black;

    &:hover {
      .sub {
        transform: scaleX(1);
      }
      .main {
        display: none;
        opacity: 0;
      }
    }
  }

  .sub {
    transform: scaleX(0);
  }
`;

const ImageWrap = styled("div")`
  width: 30%;
  display: block;
  aspect-ratio: 1 / 1;
  border-radius: 1rem;
  overflow: hidden;

	img {
		object-fit: cover;
    width: 100%;
    height: 100%;
    transition: 0.3s ease;
	}
}
`;

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);

  // 取得產品資料
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/products?page=1`);
        setProducts(res.data.products.slice(0, 3));
      } catch (err) {
        if (err instanceof AxiosError) {
          console.log(err?.response?.data.message);
        }
      }
    })()
  }, []);

  return (
    <>
      <Global />
      <Banner className="d-flex align-items-center justify-content-center">
        <Title className="text-center">
          <h2>&<em>Bloom</em></h2>
          <p>植｜物｜販｜賣｜所</p>
        </Title>
      </Banner>
      <IntroContainer>
        <Intro className="d-flex align-items-center justify-content-center">
          <h2>Meet your <strong className="fw-bold">plant</strong>, <em>bring</em> nature home</h2>
          <img src="./plant-01.jpg" alt="plant-01" className="ms-5" />
        </Intro>
      </IntroContainer>
      <div className="bg-light text-center mt-5 p-5">
        <h2 className="mb-5 fs-2">＼ New Items ／</h2>
        <div className="row row-cols-1 row-cols-md-3 mx-0 mb-5">
          {
            products.map(item => {
              const { id, category, title, price, origin_price, imageUrl, imagesUrl } = item;

              return (
                <Card className="col mb-4 mb-md-0" key={id}>
                  <NavLink to={`/product/${id}`} className="card">
                    <div className="card-body d-flex align-items-center">
                      <ImageWrap>
                        <img src={imageUrl} alt={`${title} image`} className="main" />
                        <img src={imagesUrl[0]} alt={`${title} image`} className="sub" />
                      </ImageWrap>
                      <div className="d-flex flex-column align-items-center flex-fill">
                        <span className="badge rounded-pill bg-primary fs-sm mb-2">{category}</span>
                        <h6 className="mt-1 mb-2">{title}</h6>
                        <div className="d-flex align-items-center">
                          <p className="text-secondary mb-0 me-2">$ {price}</p>
                          <small className="text-muted text-decoration-line-through">$ {origin_price}</small>
                        </div>
                      </div>
                    </div>
                  </NavLink>
                </Card>
              )
            })
          }
        </div>
        <NavLink to="/products" className="btn btn-secondary rounded-pill px-5">
          PLANT・所有植栽
          <span className="ms-3">→</span>
        </NavLink>
      </div>
      <IntroContainer className="my-5">
        <Intro className="d-flex align-items-center justify-content-center">
          <img src="./plant-06.jpg" alt="plant-06" className="me-5" />
          <h2>Every <strong className="fw-bold">plant</strong> <em>whispers</em> a story of life</h2>
        </Intro>
      </IntroContainer>
    </>
  )
}

export default Home;
