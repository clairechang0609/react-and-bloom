import { isMobile } from 'react-device-detect';
import styled from 'styled-components';

const BannerWrap = styled("div")`
  position: relative;
  background-image: url('./banner-01.jpg');
  background-position: center;
  background-size: cover;
  width: 100%;
  height: 100vh;
  font-size: 75px;
  transform-origin: top;
  transition: background-image 3s cubic-bezier(.77,0,.18,1);
  z-index: 800;

  @media screen and (min-width: 1000px) {
    font-size: 100px;
  }

  &.is-inview {
    &::after {
      opacity: 1;
    }
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: linear-gradient(to bottom, transparent, var(--background) 95%);
    background-size: cover;
    background-position: center;
    opacity: 0;
    transition: opacity 3s cubic-bezier(.77,0,.18,1);
    height: 101%;
  }
`;

const Banner = () => {
  return (
    <BannerWrap className={`d-flex align-items-center justify-content-center  ${isMobile && 'mb-5'}`} data-scroll data-scroll-offset="120%" data-scroll-repeat="true">
      <div className="text-center text-white" style={{ textShadow: '0 0 0.75rem rgba(0, 0, 0, 0.75)' }}>
        <h2 className="title" style={{ fontSize: '1em' }} data-scroll data-scroll-speed="3" data-scroll-position="top">&<em>Bloom</em></h2>
        <p style={{ fontSize: '0.925rem' }}>
          {
            Array.from('植｜物｜販｜賣｜所').map((char, index) => {
              return (
                <span key={`char-${index}`} className="d-inline-block" data-scroll data-scroll-speed="3.5" data-scroll-position="top"
                  data-scroll-delay={(0.13 - (index * 0.01)).toFixed(2)}>{char}</span>
              );
            })
          }
        </p>
      </div>
    </BannerWrap>
  )
};

export default Banner;
