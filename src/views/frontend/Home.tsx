import 'bootstrap';
import LocomotiveScroll from 'locomotive-scroll';
import { useEffect, useMemo, useRef } from 'react';
import { NavLink } from 'react-router';
import styled, { createGlobalStyle } from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
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

const IntroContainer = styled("div")`
  // margin-top: 3rem;
  // @supports (animation-timeline: scroll()) {
  //   margin-top: calc(110vh);
  // }
  // view-timeline: --section;
`;

const Intro = styled("div")`
  // animation-name: scaleAnimation;
  // animation-duration: 1ms; /* Firefox requires this to apply the animation */
  // animation-direction: alternate;
  // animation-timeline: --section;
  // animation-range: entry 0% 50%;
  max-width: 100%;
  width: 1000px;
  margin-left: auto;
  margin-right: auto;

  // @keyframes scaleAnimation {
  //   from {
  //     opacity: 0;
  //     transform: scaleX(0);
  //   }
  //   to {
  //     opacity: 1;
  //     transform: scaleX(100%);
  //   }
  // }

  > img {
    width: 40vw;

    @media screen and (min-width: 1000px) {
      width: 400px;
    }
  }
}
`;

const ImageWrap = styled("div")`
  overflow: hidden;
  flex-shrink: 0;
  height: 80vh;

  &.h-350 {
    height: 350px;
  }

  .image-outer {
    height: 100%;
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

  const swiperConfig = {
    spaceBetween: 16,
    slidesPerView: 1,
    centeredSlides: true,
    breakpoints: {
      575: {
        spaceBetween: 32,
        slidesPerView: 2
      },
      768: {
        spaceBetween: 48,
        slidesPerView: 2
      },
      1280: {
        spaceBetween: 48,
        slidesPerView: 3.5
      },
      1440: {
        spaceBetween: 48,
        slidesPerView: 4
      }
    }
  };

  const { products } = useGetProducts({ isShowLoading: false});
  const filterProducts = useMemo(() => {
    return products?.slice(0, 6);
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
      <div ref={container}>
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
        <IntroContainer>
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
        </IntroContainer>
        <IntroContainer>
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
              <ImageWrap className="w-40 h-350 ms-auto pt-5" data-scroll data-scroll-speed="2">
                <div className="image-outer" data-scroll data-scroll-speed="-3">
                  <img src="./plant-04.jpg" alt="plant-04" />
                </div>
              </ImageWrap>
            </div>
          </div>
        </IntroContainer>
        <div className="text-center py-5">
          <h3 className="title fs-2">＼ New Items ／</h3>
          {
            filterProducts.length
              ? <Swiper {...swiperConfig} className="py-5">
                {
                  filterProducts.map(item => {
                    return (
                      <SwiperSlide className="align-self-center" key={item.id}>
                        <ProductCard item={item} />
                      </SwiperSlide>
                    )
                  })
                }
              </Swiper>
              : ''
          }
          <NavLink to="/products" className="btn btn-secondary rounded-pill px-5">
            PLANTS・所有植栽
            <span className="ms-3">→</span>
          </NavLink>
        </div>
        <div className="c-direction-block_item_inner is-inview" data-scroll data-scroll-direction="horizontal" data-scroll-speed="6">
            I'm moving in this direction
        </div>
      </div>
    </>
  )
}

export default Home;
