import styled from "styled-components";

const IntroWrap = styled("div")`
  max-width: 100%;
  width: 1000px;
  margin-left: auto;
  margin-right: auto;
`;

const IntroWrapWide = styled(IntroWrap)`
  width: 1280px;
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
  line-height: 1;
  font-weight: 300;
  font-size: calc(7vw + 0.5rem);

  @media screen and (min-width: 1000px) {
    font-size: 75px;
  }

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
    color: var(--success);
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
      bottom: -10px;
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


const Intro = () => {
  return (
    <>
      <IntroWrap className="d-flex align-items-center justify-content-center px-3">
        <div className="w-50">
          <GuideTitle className="title mb-5" data-scroll>
            <span>Meet your </span>
            <span><strong className="fw-bold">plant</strong>, <em>bring</em> </span>
            <span>nature home</span>
          </GuideTitle>
          <GuideContent data-scroll data-scroll-speed="1" data-scroll-repeat>
            <small>
              拾起一抹綠意<br />
              讓自然融入生活
            </small>
          </GuideContent>
        </div>
        <ImageWrap className="ms-auto w-40 w-lg-50" data-scroll data-scroll-speed="3">
          <div className="image-outer" data-scroll data-scroll-speed="-2">
            <img src="./plant-01.jpg" alt="plant-01" />
          </div>
        </ImageWrap>
      </IntroWrap>
      <IntroWrapWide className="d-flex align-items-center justify-content-center px-3 px-lg-5 mt-5 mt-lg-0">
        <ImageWrap className="w-40 w-lg-30 mb-5" data-scroll data-scroll-speed="2">
          <div className="image-outer" data-scroll data-scroll-speed="-2">
            <img src="./plant-06.jpg" alt="plant-06" />
          </div>
        </ImageWrap>
        <div className="w-50 ms-auto" style={{ verticalAlign: 'bottom' }}>
          <GuideTitle className="title mb-5" data-scroll data-scroll-speed="1">
            <span>Every <strong className="fw-bold">plant</strong> </span>
            <span><em>whispers</em> a story </span>
            <span> of life</span>
          </GuideTitle>
          <GuideContent data-scroll data-scroll-speed="3" data-scroll-repeat>
            <small>
              植物的細語<br />
              療癒生活每個角落
            </small>
          </GuideContent>
          <ImageWrap className="d-none d-lg-block w-40 ms-auto pt-5" data-scroll data-scroll-speed="2">
            <div className="image-outer" data-scroll data-scroll-speed="-2">
              <img src="./plant-10.jpg" alt="plant-10" />
            </div>
          </ImageWrap>
        </div>
      </IntroWrapWide>
    </>
  )
}

export default Intro;
