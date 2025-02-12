import 'bootstrap';
import styled, { createGlobalStyle } from 'styled-components';
import '../../assets/home.scss';
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const Global = createGlobalStyle`
  body {
    color: #333;
    font-family: 'Fraunces', Didot, 'Bodoni MT', 'Noto Serif Display', 'URW Palladio L', P052, Sylfaen, serif;
  }
`;

const Intro = styled("div")`
  animation-name: scaleAnimation;
  animation-duration: 1ms; /* Firefox requires this to apply the animation */
  animation-direction: alternate;
  animation-timeline: scroll(block nearest);
  max-width: 100%;
  width: 1000px;
  margin-left: auto;
  margin-right: auto;

  @keyframes scaleAnimation {
    0% {
      opacity: 0;
      transform: scaleX(0);
    }
    50% {
      opacity: 1;
      transform: scaleX(100%);
    }
  }

  h2 {
    line-height: 1;
    font-weight: 200;
    font-size: calc(7vw + 1rem);
  }

  strong {
    color:rgb(37, 106, 76);
  }

  img {
    margin-left: 1rem;
    width: calc(35vw - 3rem);
  }
}
`

const A = styled("div")`
  html {
    scroll-snap-type: y mandatory;
    timeline-scope: --section, --main, --site-header;
  }

  body,
  .content {
    background-color: var(--color-background, black);
  }

  main {
    view-timeline: --main;
  }

  .section {
    /* Creating a snapping rule on the section element */
    scroll-snap-align: start;
    scroll-snap-stop: always;/
    view-timeline: --section;

    /* Set each section to the full dynamic height of the viewport */
    height: 100dvh;
  }

  .content {
    /* Fix the content, so it doesn't scroll with the section */
    overflow: hidden;
    position: fixed;
    inset: 0;

    /* Animate the content based on the section scrolling */
    --contrast: 4;
    --blur: 0.5rem;

    animation: blink ease-in-out both;
    animation-timeline: --section;
  }

  @keyframes blink {
    0%,
    100% {
      filter: blur(var(--blur)) contrast(var(--contrast));
      opacity: 0;
      visibility: hidden;
    }

    50% {
      filter: blur(0) contrast(1);
      opacity: 1;
      visibility: visible;
    }
  }

  .indicator::before {
    animation: indicate linear both;
    animation-timeline: --main;
    animation-range: contain;
  }

  @keyframes indicate {
    0% {
      --color-indicator: var(--color-primary);
      transform: translateY(0);
    }

    25% {
      --color-indicator: var(--color-yellow);
    }

    50% {
      --color-indicator: var(--color-secondary);
    }

    75% {
      --color-indicator: var(--color-red);
    }

    100% {
      --color-indicator: var(--color-purple);
      transform: translateY(
        calc(var(--indicator-total-height) - var(--indicator-size))
      );
    }
  }

  .site-header label:last-of-type {
    view-timeline: --site-header inline;
  }

  .site-header::after {
    animation: fade-scroll ease-in-out both;
    animation-timeline: --site-header;
    animation-range: entry-crossing;
  }

  @keyframes fade-scroll {
    0% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }

  /* Change animation based on radio checked */
  body:has([value="horizontal-scroll"]:checked) .content {
    animation: horizontal-scroll ease-in-out both;
    animation-timeline: --section;
  }

  body:has([value="backwards-scroll"]:checked) .content {
    animation: backwards-scroll ease-in-out both;
    animation-timeline: --section;
  }

  body:has([value="zoom-scroll"]:checked) .content {
    animation: zoom-scroll ease-in-out both;
    animation-timeline: --section;
  }

  /* Alternative animations */
  /* Very cool, try it */
  @keyframes horizontal-scroll {
    0% {
      transform: translate3d(100%, 0%, 0);
    }

    50% {
      transform: none;
    }

    100% {
      transform: translate3d(-100%, 0%, 0);
    }
  }

  /* Befuddling, try it */
  @keyframes backwards-scroll {
    0% {
      transform: translate3d(0%, -100%, 0);
    }

    50% {
      transform: none;
    }

    100% {
      transform: translate3d(0%, 100%, 0);
    }
  }

  /* WIP */
  @keyframes zoom-scroll {
    0% {
      filter: blur(5rem);
      transform: scale(0);
      opacity: 0;
      visibility: hidden;
    }

    50% {
      filter: blur(0);
      transform: none;
      opacity: 1;
      visibility: visible;
    }

    100% {
      filter: blur(3rem);
      transform: scale(1.5);
      opacity: 0;
      visibility: hidden;
    }
  }
`;

const Home = () => {
  return (
    <>
      <Global />
      <div className="vh-100">
      </div>
      <Intro className="d-flex align-items-center justify-content-center">
        {/* <h1>
          Meet <br />
          Your <br />
          PLANTS
        </h1> */}
        <h2>Meet your <strong>Plant</strong>, <em>bring</em> nature home</h2>
        <img src="/plant-01.jpg" alt="plant-01" />
      </Intro>
    </>
  )
}

export default Home;
