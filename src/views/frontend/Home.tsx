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

const Global = createGlobalStyle`
  body {
    background-color: #dfdbcf;
  }

  .image-outer1 {
    width: 150px;
    height: 150px;
    overflow: hidden;
    border-radius: 50%;
    margin-top: -5rem;
    border: 1px solid white;
    margin-bottom: 2rem;
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
        <div className="row">
          <div className="col-12">
            <div className="d-inline-block ms-auto text-center">
              <h3 className="title fs-2 mb-3">＼ Featured Articles ／</h3>
              <small className="d-block">
                精選百科 <br />
                如何照料你的植物
              </small>
            </div>
          </div>
          <div className="col-md-9">
            <div className="row row-cols-1 row-cols-lg-3">
              <div className="card bg-white border-0 rounded-0" data-scroll data-scroll-speed="1">
                <div className="card-body text-center p-5">
                  <div className="image-outer1 mx-auto">
                    <img src="./plant-08.jpg" alt="plant-08" className="object-fit-cover h-100 w-100" />
                  </div>
                  <small className="badge rounded-pill text-bg-light">2025-02-26</small>
                  <h5 className="card-title fs-4 my-3">植栽照護</h5>
                  <p className="card-text text-start">植物的照護技巧，讓你的植物茁壯成長，植物的照護技巧，讓你的植物茁壯成長</p>
                  <small className="d-flex flex-wrap">
                    <small className="badge rounded-pill text-bg-primary me-1">日照</small>
                    <small className="badge rounded-pill text-bg-primary me-1">補水</small>
                  </small>
                </div>
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
