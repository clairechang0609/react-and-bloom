import 'bootstrap';
import LocomotiveScroll from 'locomotive-scroll';
import { useEffect, useMemo, useRef } from 'react';
import { createGlobalStyle } from 'styled-components';
import Footer from '../../components/frontend/Footer';
import Banner from '../../components/frontend/home/Banner';
import Contact from '../../components/frontend/home/Contact';
import Intro from '../../components/frontend/home/Intro';
import NewArticles from '../../components/frontend/home/NewArticles';
import NewProducts from '../../components/frontend/home/NewProducts';
import PlantCategories from '../../components/frontend/home/PlantCategories';
import Navbar from '../../components/frontend/Navbar';
import useGetArticles from '../../hooks/frontend/useGetArticles';
import useGetProducts from '../../hooks/frontend/useGetProducts';

const Global = createGlobalStyle`
  body {
    background-color: var(--background);
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

  const { articles } = useGetArticles({ isShowLoading: false});
  const filterArticles = useMemo(() => {
    return articles?.slice(0, 2);
  }, [articles]);

  useEffect(() => {
    if (container.current) {
      containerInstance.current = new LocomotiveScroll({
        el: container.current,
        smooth: true,
        lerp: .06,
        multiplier: .5
      });

      containerInstance.current.on("scroll", ({ scroll }) => {
        if (scroll.y > lastScrollY.current && scroll.y > 75) {
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
    if (filterProducts.length) {
      setTimeout(() => {
        containerInstance.current?.update();
      }, 500);
    }
  }, [filterProducts]);

  return (
    <>
      <Global />
      <Navbar ref={navbarRef} />
      <div className="overflow-hidden position-relative" ref={container}>
        <Banner />
        <Intro />
        <NewProducts filterProducts={filterProducts} />
        <PlantCategories />
        <NewArticles filterArticles={filterArticles} />
        <Contact />
        <Footer />
      </div>
    </>
  )
}

export default Home;
