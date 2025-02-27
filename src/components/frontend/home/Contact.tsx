import { createGlobalStyle } from "styled-components";

const Global = createGlobalStyle`
  .contact-wrap {
    height: 350px;
  }

  .contact-item {
    position: relative;
    padding: 1rem;
    transition: 0.5s cubic-bezier(0,.85,.45,1);
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform: translateY(-101%);
      background-color: #e9e9e3;
      transition: transform 0.2s ease;
      z-index: -1;
    }

    &:hover {
      padding: 1rem 3rem;

      &::after {
        transform: translate(0);
      }
    }
  }
`;

const Contact = () => {
  return (
    <>
      <Global />
      <div className="bg-light" style={{ marginTop: '2rem', marginBottom: '4rem' }} data-scroll data-scroll-speed="-1">
        <div className="contact-wrap row">
          <div className="col-md-6 position-relative">
            <img src="./banner-04.jpg" alt="banner-04" className="opacity-75 position-absolute object-fit-cover w-100 h-100" />
          </div>
          <div className="col-md-6 p-5">
            <h5 className="title mb-4 fs-1">Contact &<em>Bloom</em></h5>
            <a href="mailto:service@andbloom.com" target="_blank" rel="noopener" className="contact-item d-flex align-items-center justify-content-between border-bottom border-dark">
              <i className="bi bi-envelope"></i>
              <span>service@andbloom.com</span>
            </a>
            <a href="tel:0800-123-123" className="contact-item d-flex align-items-center justify-content-between border-bottom border-dark">
              <i className="bi bi-telephone"></i>
              <span>0800-123-123</span>
            </a>
            <a href="https://www.instagram.com/&bloom" target="_blank" rel="noopener" className="contact-item d-flex align-items-center justify-content-between border-bottom border-dark">
              <i className="bi bi-instagram"></i>
              <span>Follow &Bloom on Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Contact;
