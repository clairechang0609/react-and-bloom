import styled from "styled-components";

const ContentWrap = styled("div")`
  padding-top: max(env(safe-area-inset-top), 1rem);
  padding-bottom: max(env(safe-area-inset-bottom), 1rem);
  padding-left: max(env(safe-area-inset-left), 0.5rem);
  padding-right: max(env(safe-area-inset-right), 0.5rem);

  @media screen and (min-width: 768px) {
    padding-top: max(env(safe-area-inset-top), 1.5rem);
    padding-bottom: max(env(safe-area-inset-bottom), 1.5rem);
    padding-left: max(env(safe-area-inset-left), 1.5rem);
    padding-right: max(env(safe-area-inset-right), 1.5rem);
  }
`;

const Footer = () => {
  return (
    <div className="fs-tiny d-block position-absolute bottom-0 w-100">
      <ContentWrap className="mx-4 d-flex flex-column flex-md-row justify-content-between">
        <span>© &Bloom 2025 All Rights Reserved.</span>
        <span>所有資源為練習使用，無商業用途。</span>
      </ContentWrap>
    </div>
  )
}

export default Footer;
