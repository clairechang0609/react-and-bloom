import 'bootstrap';
import LocomotiveScroll from 'locomotive-scroll';
import { useEffect, useMemo, useRef } from 'react';
import { createGlobalStyle } from 'styled-components';
import Footer from '../../components/frontend/Footer';
import Banner from '../../components/frontend/home/Banner';
import Contact from '../../components/frontend/home/Contact';
import Intro from '../../components/frontend/home/Intro';
import NewProducts from '../../components/frontend/home/NewProducts';
import PlantCategories from '../../components/frontend/home/PlantCategories';
import Navbar from '../../components/frontend/Navbar';
import useGetProducts from '../../hooks/frontend/useGetProducts';
import { NavLink } from 'react-router';

const Global = createGlobalStyle`
  body {
    background-color: #dfdbcf;
  }

  .image-outer1 {
    width: 100%;
    aspect-ratio: 1 / 1;
    overflow: hidden;
  }

  .articles-wrap {
    max-width: 1000px;
    margin: 5rem auto;

    .tags-wrap {
      margin-bottom: 2.5rem;
      padding-bottom: 2.5rem;
      border-bottom: 2px solid black;
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
    return products?.slice(0, 5);
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
          navbarRef.current?.classList.add("hidden");
        } else {
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
        <Banner />
        <Intro />
        <NewProducts filterProducts={filterProducts} />
        <PlantCategories />
        <div className="articles-wrap">
          <div className="row align-items-center my-5 py-5">
            <div className="col-md-6 px-5">
              <div data-scroll data-scroll-speed="-1" data-scroll-delay="0.1">
                <div className="tags-wrap d-flex justify-content-between align-items-center">
                  <small className="tags d-block">日照｜補水</small>
                  <small className="badge rounded-pill bg-transparent border border-primary text-primary">2025-02-26</small>
                </div>
                <h5 className="card-title fs-4 mb-4">植栽照護</h5>
                <p className="mb-5">植物的照護技巧，讓你的植物茁壯成長，植物的照護技巧，讓你的植物茁壯成長</p>
                <NavLink to="/" className="btn btn-secondary rounded-pill px-5 position-relative">
                  看更多
                  <span className="btn-arrow ms-3 position-absolute">→</span>
                </NavLink>
              </div>
            </div>
            <div className="col-md-6 px-5">
              <div className="image-outer1">
                <img src="./plant-08.jpg" alt="plant-08" className="object-fit-cover h-100 w-100" />
              </div>
            </div>
          </div>
          <div className="row align-items-center my-5 py-5">
            <div className="col-md-6 px-5">
              <div className="image-outer1">
                <img src="./plant-08.jpg" alt="plant-08" className="object-fit-cover h-100 w-100" />
              </div>
            </div>
            <div className="col-md-6 px-5">
              <div data-scroll data-scroll-speed="-1" data-scroll-delay="0.1">
                <div className="tags-wrap d-flex justify-content-between align-items-center">
                  <small className="tags d-block">日照｜補水</small>
                  <small className="badge rounded-pill bg-transparent border border-primary text-primary">2025-02-26</small>
                </div>
                <h5 className="card-title fs-4 mb-4">植栽照護</h5>
                <p className="mb-5">植物的照護技巧，讓你的植物茁壯成長，植物的照護技巧，讓你的植物茁壯成長</p>
                <NavLink to="/" className="btn btn-secondary rounded-pill px-5 position-relative">
                  看更多
                  <span className="btn-arrow ms-3 position-absolute">→</span>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
        <Contact />
        <Footer />
      </div>
    </>
  )
}

export default Home;
