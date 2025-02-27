import styled from "styled-components";

const ContactWrap = styled("div")`
  height: 350px;
`;

const ContactItem = styled("a")`
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
    background-color: var(--light-gray);
    transition: transform 0.2s ease;
    z-index: -1;
  }

  &:hover {
    padding: 1rem 3rem;

    &::after {
      transform: translate(0);
    }
  }
`;

const Contact = () => {
  return (
    <div className="bg-light" style={{ marginTop: '2rem', marginBottom: '4rem' }} data-scroll data-scroll-speed="-1">
      <ContactWrap className="row">
        <div className="col-md-6 position-relative">
          <img src="./banner-04.jpg" alt="banner-04" className="opacity-75 position-absolute object-fit-cover w-100 h-100" />
        </div>
        <div className="col-md-6 p-5">
          <h5 className="title mb-4 fs-1">Contact &<em>Bloom</em></h5>
          <ContactItem href="mailto:service@andbloom.com" target="_blank" rel="noopener" className="d-flex align-items-center justify-content-between border-bottom border-dark">
            <i className="bi bi-envelope"></i>
            <span>service@andbloom.com</span>
          </ContactItem>
          <ContactItem href="tel:0800-123-123" className="d-flex align-items-center justify-content-between border-bottom border-dark">
            <i className="bi bi-telephone"></i>
            <span>0800-123-123</span>
          </ContactItem>
          <ContactItem href="https://www.instagram.com/&bloom" target="_blank" rel="noopener" className="d-flex align-items-center justify-content-between border-bottom border-dark">
            <i className="bi bi-instagram"></i>
            <span>Follow &Bloom on Instagram</span>
          </ContactItem>
        </div>
      </ContactWrap>
    </div>
  )
}

export default Contact;
