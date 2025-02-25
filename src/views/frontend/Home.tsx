import 'bootstrap';
import LocomotiveScroll from 'locomotive-scroll';
import { useEffect, useMemo, useRef } from 'react';
import { NavLink } from 'react-router';
import styled, { createGlobalStyle } from 'styled-components';
import Footer from '../../components/frontend/Footer';
import Navbar from '../../components/frontend/Navbar';
import ProductCard from '../../components/frontend/ProductCard';
import useGetProducts from '../../hooks/frontend/useGetProducts';

const Global = createGlobalStyle`
  body {
    background-color: #dfdbcf;
  }

  h2 {
    line-height: 1;
    font-weight: 300;
    font-size: calc(7vw + 1rem);

    @media screen and (min-width: 1000px) {
      font-size: 75px;
    }
  }

  .swiper-slide.swiper-slide-active .image-wrap {
    aspect-ratio: 3 / 4;
    transition: aspect-ratio 0.5s ease-out;
  }

  .swiper-slide .image-wrap {
    transition: 0.25s ease-in 0.5s;
  }

  .product-card-wrap {
    max-width: 750px;
    width: 100%;
  }

  .btn-arrow {
    right: 1.5rem;
    transition: 0.25s ease-in;
  }

  .btn:hover .btn-arrow {
    right: 0.75rem;
  }

  .c-fixed_wrapper {
    padding-top: 70px;
  }

  .c-fixed, .c-fixed_target {
    left: 0;
    position: absolute;
    right: 0;
    top: -80vh;
  }

  .c-fixed_target {
    bottom: -100vh;
    top: -100vh;
  }

  .h-350 {
    height: 350px;
  }
`;

const Banner = styled("div")`
  position: relative;
  background-image: url('./banner-01.jpg');
  background-position: center;
  background-size: cover;
  width: 100%;
  height: 100vh;
  font-size: 100px;
  transform-origin: top;
  transition: background-image 3s cubic-bezier(.77,0,.18,1);

  &.is-inview {
    &::after {
      opacity: 1;
    }
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: linear-gradient(to bottom, transparent, #dfdbcf);
    background-size: cover;
    background-position: center;
    opacity: 0;
    transition: opacity 3s cubic-bezier(.77,0,.18,1);
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

const Intro = styled("div")`
  max-width: 100%;
  width: 1000px;
  margin-left: auto;
  margin-right: auto;
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

const GuideTitle = styled("h2")`
  span {
    transform: translateY(100%) rotateX(-80deg);
    opacity: 0;
    transition: opacity .8s cubic-bezier(.215,.61,.355,1), transform .8s cubic-bezier(.215,.61,.355,1);
    transform-origin: center top;
    transform-style: preserve-3d;
    transition-delay: .4s;
    display: block;
  }

  &.is-inview {
    span {
      transform: none;
      opacity: 1;
    }
  }

  strong {
    color:rgb(37, 106, 76);
  }
`;

const GuideContent = styled("div")`
  small {
    transform: scale(0);
    transition: transform 0.6s cubic-bezier(.17,.67,.3,1.33);
    transition-delay: 0.6s;
    transform-origin: top left;
    display: block;
    line-height: 200%;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 200px;
      height: 2px;
      background-color: black;
      transform: scaleX(0);
      transition: transform 1.2s cubic-bezier(.77,0,.18,1);
      transition-delay: 0.6s;
      transform-origin: left;
    }
  }

  &.is-inview small {
    transform: scale(1);

    &::after {
      transform: scaleX(1);
    }
  }
`;

const Home = () => {
  const container = useRef<HTMLDivElement | null>(null);
  const containerInstance = useRef<LocomotiveScroll | null>(null);
  const navbarRef = useRef<HTMLDivElement | null>(null);
  const lastScrollY = useRef(0);

  const { products } = useGetProducts({ isShowLoading: false});
  const filterProducts = useMemo(() => {
    return products?.slice(0, 3);
  }, [products]);

  useEffect(() => {
    if (container.current) {
      containerInstance.current = new LocomotiveScroll({
        el: container.current,
        smooth: true,
        lerp: .06,
        multiplier: .5
      });

      containerInstance.current.on("scroll", ({ scroll }) => {
        if (scroll.y > lastScrollY.current) {
          // 往下滾 → 隱藏 Navbar
          navbarRef.current?.classList.add("hidden");
        } else {
          // 往上滾 → 顯示 Navbar
          navbarRef.current?.classList.remove("hidden");
        }

        lastScrollY.current = scroll.y;
      });

      return () => {
        containerInstance.current?.destroy();
      };
    }
  }, []);

  useEffect(() => {
    if (products.length) {
      containerInstance.current?.update();
    }
  }, [products]);

  return (
    <>
      <Global />
      <Navbar ref={navbarRef} />
      <div className="overflow-hidden" ref={container}>
        <Banner className="d-flex align-items-center justify-content-center" data-scroll data-scroll-offset="120%" data-scroll-repeat="true">
          <Title className="text-center">
            <h2 className="title" data-scroll data-scroll-speed="3" data-scroll-position="top">&<em>Bloom</em></h2>
            <p>
              {
                Array.from('植｜物｜販｜賣｜所').map((char, index) => {
                  return (
                    <span key={`char-${index}`} className="d-inline-block" data-scroll data-scroll-speed="3.5" data-scroll-position="top"
                      data-scroll-delay={(0.13 - (index * 0.01)).toFixed(2)}>{char}</span>
                  );
                })
              }
            </p>
          </Title>
        </Banner>
        <Intro className="d-flex align-items-center justify-content-center">
          <div>
            <GuideTitle className="title mb-5" data-scroll>
              <span>Meet your </span>
              <span><strong className="fw-bold">plant</strong>, <em>bring</em> </span>
              <span>nature home</span>
            </GuideTitle>
            <GuideContent data-scroll data-scroll-speed="2">
              <small>
                拾起一抹綠意<br />
                讓自然融入生活
              </small>
            </GuideContent>
          </div>
          <ImageWrap className="ms-auto w-50" data-scroll data-scroll-speed="3">
            <div className="image-outer" data-scroll data-scroll-speed="-2">
              <img src="./plant-01.jpg" alt="plant-01" />
            </div>
          </ImageWrap>
        </Intro>
        <div className="d-flex align-items-center justify-content-center px-5">
          <ImageWrap className="w-30 mb-5" data-scroll data-scroll-speed="2">
            <div className="image-outer" data-scroll data-scroll-speed="-3">
              <img src="./plant-06.jpg" alt="plant-06" />
            </div>
          </ImageWrap>
          <div className="w-50 ms-auto" style={{ verticalAlign: 'bottom' }}>
            <GuideTitle className="title mb-5" data-scroll data-scroll-speed="1">
              <span>Every <strong className="fw-bold">plant</strong> </span>
              <span><em>whispers</em> a story </span>
              <span> of life</span>
            </GuideTitle>
            <GuideContent data-scroll data-scroll-speed="3">
              <small>
                植物的細語<br />
                療癒生活每個角落
              </small>
            </GuideContent>
            <ImageWrap className="w-40 ms-auto pt-5" data-scroll data-scroll-speed="2">
              <div className="image-outer" data-scroll data-scroll-speed="-3">
                <img src="./plant-04.jpg" alt="plant-04" />
              </div>
            </ImageWrap>
          </div>
        </div>
        <div className="row">
          <div className="col-md-5 c-fixed_wrapper position-relative overflow-hidden vh-100">
            <div className="c-fixed_target" id="fixed-target"></div>
            <div className="c-fixed d-flex flex-column align-items-center text-center vh-100" data-scroll data-scroll-sticky data-scroll-target="#fixed-target">
              <h3 className="title fs-2 mb-3">＼ New Items ／</h3>
              <small className="d-block">
                最新植栽推薦 <br />
                快來挑選你的居家綠色夥伴
              </small>
              <svg className="d-block text-white mt-4" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="50px" version="1.1" id="Capa_1" viewBox="0 0 227.096 227.096" xmlSpace="preserve">
                <g>
                  <polygon points="152.835,39.285 146.933,45.183 211.113,109.373 0,109.373 0,117.723 211.124,117.723 146.933,181.902 152.835,187.811 227.096,113.55   "/>
                </g>
              </svg>
            </div>
          </div>
          <div style={{ marginTop: '-5rem' }} className="col-md-7 text-center" data-scroll data-scroll-delay="0.04" data-scroll-speed="6">
            <div className="product-card-wrap">
              {
                filterProducts.length
                  ? <>
                    {
                      filterProducts.map(item => {
                        return <div className="mb-5 text-start" key={item.id}>
                          <ProductCard item={item}>
                            <small className="d-block mt-3 text-dark">{item.description}</small>
                          </ProductCard>
                        </div>
                      })
                    }
                    </>
                  : ''
              }
              <NavLink to="/products" className="btn btn-secondary rounded-pill px-5 mt-4 position-relative">
                所有植栽
                <span className="btn-arrow ms-3 position-absolute">→</span>
              </NavLink>
            </div>
          </div>
        </div>
        <div className="px-4" style={{ marginBottom: '4rem' }} data-scroll data-scroll-speed="-1">
          <div className="position-relative h-350">
<img src="./banner-02.jpg" alt="banner-02" className="position-absolute object-fit-cover w-100 h-100" />
          </div>

        </div>
        <Footer />
      </div>
    </>
  )
}

export default Home;
