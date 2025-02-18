import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { loadingData } from '../slice/loadingSlice';

const LoadingContainer = styled("div")`
  z-index: 2000;
`;

const FullPageLoading = () => {
  const { isFullPageLoading } = useSelector(loadingData);

  return (
    <>
      {isFullPageLoading && (
        <LoadingContainer className="fixed-top w-100 h-100 bg-white bg-opacity-75 d-flex justify-content-center align-items-center">
          <div className="spinner-border text-primary">
            <span className="visually-hidden">Loading...</span>
          </div>
        </LoadingContainer>
      )}
    </>
  );
};

export default FullPageLoading;
