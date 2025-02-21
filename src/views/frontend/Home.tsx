import 'bootstrap';
import { useMemo } from 'react';
import { NavLink } from 'react-router';
import styled, { createGlobalStyle } from 'styled-components';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ProductCard from '../../components/frontend/ProductCard';
import useGetProducts from '../../hooks/frontend/useGetProducts';

const Global = createGlobalStyle`
  html {
    scroll-snap-type: y mandatory;
    timeline-scope: --section;
  }

  h2 {
    line-height: 1;
    font-weight: 300;
    font-size: calc(7vw + 1rem);

    @media screen and (min-width: 1000px) {
      font-size: 100px;
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

const Home = () => {
  const swiperConfig = {
    modules: [ Autoplay ],
    autoplay: true,
    loop: true,
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

  const { products } = useGetProducts({ page: 1 });
  const filterProducts = useMemo(() => {
    return products?.slice(0, 6);
  }, [products])

  return (
    <>
      <Global />
      <Banner className="d-flex align-items-center justify-content-center">
        <Title className="text-center">
          <h2 className="title">&<em>Bloom</em></h2>
          <p>植｜物｜販｜賣｜所</p>
        </Title>
      </Banner>
      <IntroContainer>
        <Intro className="d-flex align-items-center justify-content-center">
          <h2 className="title">Meet your <strong className="fw-bold">plant</strong>, <em>bring</em> nature home</h2>
          <img src="./plant-01.jpg" alt="plant-01" className="ms-5" />
        </Intro>
      </IntroContainer>
      <div className="bg-light bg-opacity-75 text-center mt-5 py-5">
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
      <IntroContainer className="my-5">
        <Intro className="d-flex align-items-center justify-content-center">
          <img src="./plant-06.jpg" alt="plant-06" className="me-5" />
          <h2 className="title">Every <strong className="fw-bold">plant</strong> <em>whispers</em> a story of life</h2>
        </Intro>
      </IntroContainer>
    </>
  )
}

export default Home;
