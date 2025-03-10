import { useSelector } from 'react-redux';
import { loadingData } from '../slice/loadingSlice';

const FullPageLoading = () => {
  const { isFullPageLoading } = useSelector(loadingData);

  return (
    <>
      {isFullPageLoading && (
        <div className="fixed-top w-100 h-100 bg-white bg-opacity-75 d-flex justify-content-center align-items-center"
          style={{ zIndex: '2000' }}>
          <div className="spinner-border text-primary">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </>
  );
};

export default FullPageLoading;
