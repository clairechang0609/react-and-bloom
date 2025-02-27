import styled from 'styled-components';

const BannerWrap = styled("div")`
  position: relative;
  background-image: url('./banner-01.jpg');
  background-position: center;
  background-size: cover;
  width: 100%;
  height: 100vh;
  font-size: 100px;
  transform-origin: top;
  transition: background-image 3s cubic-bezier(.77,0,.18,1);
  z-index: 800;

  &.is-inview {
    &::after {
      opacity: 1;
    }
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: linear-gradient(to bottom, transparent, #e9e9e3 95%);
    background-size: cover;
    background-position: center;
    opacity: 0;
    transition: opacity 3s cubic-bezier(.77,0,.18,1);
    height: 101%;
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

const Banner = () => {
  return (
    <BannerWrap className="d-flex align-items-center justify-content-center" data-scroll data-scroll-offset="120%" data-scroll-repeat="true">
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
    </BannerWrap>
  )
};

export default Banner;
