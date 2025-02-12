import 'bootstrap';
import styled from 'styled-components';
import '../../assets/home.scss';
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const Container = styled("div")`
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
      <Container>
        <header className="site-header">
          <h1 className="sr-only">Scrollnapping animations</h1>
          <div className="fieldset-wrapper">
            <fieldset>
              <legend className="sr-only">Effects</legend>
              <input type="radio" id="blink-effect" name="effect" value="blink" checked className="sr-only" />
              <label htmlFor="blink-effect">Blink</label>

              <input type="radio" id="horizontal-scroll-effect" name="effect" value="horizontal-scroll" className="sr-only" />
              <label htmlFor="horizontal-scroll-effect">Horizontal scroll</label>

              <input type="radio" id="backwards-scroll-effect" name="effect" value="backwards-scroll" className="sr-only" />
              <label htmlFor="backwards-scroll-effect">Backwards scroll</label>

              <input type="radio" id="zoom-scroll-effect" name="effect" value="zoom-scroll" className="sr-only" />
              <label htmlFor="zoom-scroll-effect">Zoom scroll</label>
            </fieldset>
          </div>

          <nav>
            <ul className="indicator">
              <li><a href="#snapping"><span className="sr-only">Snapping</span></a></li>
              <li><a href="#scrolling"><span className="sr-only">Scrolling</span></a></li>
              <li><a href="#layout"><span className="sr-only">Layout</span></a></li>
              <li><a href="#transition"><span className="sr-only">Transition</span></a></li>
              <li><a href="#caveats"><span className="sr-only">Caveats</span></a></li>
            </ul>
          </nav>
        </header>
        <main>
          <section id="snapping" className="section">
            <div className="content">
              <h2><strong>First</strong>, we set up the <em>snapping</em> points</h2>

              <div className="text">
                <img src="https://assets.codepen.io/197359/flower-white.png" alt="" />
                <p>We set the scrolling element, in this case our <code className="selector">HTML</code> element, to forcibly snap to the Y axis by using <code className="property">scroll-snap-type: y mandatory</code>.</p>

                <p>And then we set <code className="selector">section</code> as the snapping elements by using <code className="property">scroll-snap-align: start</code>.</p>
              </div>
            </div>
          </section>
          <section id="scrolling" className="section">
            <div className="content">
              <h2><strong>Next</strong>, we set up the <em>scrolling</em> animation</h2>

              <div className="text">
                <img src="https://assets.codepen.io/197359/flower-yellow.png" alt="" />
                <p>We track the <code className="property">view()</code> position of the <code className="selector">section</code> elements using the named timeline <code className="property">view-timeline: --section;</code>. We had previously set the <code className="property">timeline-scope: --section</code> up in our <code className="selector">HTML</code> element, so we can access it from anywhere in the document.</p>

                <p>We animate the <code className="selector">.content</code> children using <code className="property">animation-timeline: --section;</code>. The <code className="selector">.content</code> element will now animate based on its parent <code className="selector">section</code>'s position. This is important due to how we're handling the layout in the next section.</p>
              </div>
            </div>
          </section>
          <section id="layout" className="section">
            <div className="content">
              <h2><strong>Then</strong>, we position a <em>fixed</em> layout</h2>

              <div className="text">
                <img src="https://assets.codepen.io/197359/flower-blue.png" alt="" />
                <p>We set the <code className="selector">.content</code> elements to <code className="property">position: fixed</code>, so they're removed from the normal document flow and stack on top of each other, giving them a solid background, so only one is visible at a time.</p>

                <p>Their parent <code className="selector">section</code>s are positioned as normal in the layer below, taking up space, scroll-snapping, and powering the <code className="property">animation-timeline</code>.</p>
              </div>
            </div>
          </section>
          <section id="transition" className="section">
            <div className="content">
              <h2><strong>Finally</strong>, we create the <em>transition</em> effects</h2>

              <div className="text">
                <img src="https://assets.codepen.io/197359/flower-red.png" alt="" />
                <p>By setting the <code className="selector">.content</code> elements to <code className="property">position: fixed</code>, we can now transition between them without a visible scrolling movement.</p>

                <p>We create a normal <code className="selector">@keyframe</code> animation to our liking to transition between them. Check the navigation menu to see different effects.</p>
              </div>
            </div>
          </section>
          <section id="caveats" className="section">
            <div className="content">
              <h2><strong>Caveats</strong></h2>

              <div className="text">
                <img src="https://assets.codepen.io/197359/flower-purple.png" alt="" />
                <ul>
                  <li>Scrolling animations are not currently available in Firefox. This demo is using a polyfill.</li>
                  <li>This layout is fragile due to the use of <code className="property">position: fixed</code>. You need to carefully manage stacking contexts.</li>
                  <li>Snapping points have their own caveats, such as content taller than the viewport becoming inaccessible, along with the general annoyance of scrolljacking.</li>
                  <li>The <code className="selector">blink</code> effect uses the <code className="property">contrast()</code> filter, which modifies the colors of the entire section. Thus, the background is set to black (or white), ensuring that it appears unchanged during transitions due to already being at maximum contrast.</li>
                  </ul>
              </div>
            </div>
          </section>
        </main>

        <footer>
          <p>That's it <span className="emoji">🌸</span></p>
        </footer>
      </Container>
    </>
  )
}

export default Home;
