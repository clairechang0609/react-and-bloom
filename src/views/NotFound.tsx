import { NavLink } from "react-router";

const NotFound = () => {
  return (
    <div className="fixed-top vh-100 d-flex flex-column align-items-center justify-content-center text-center bg-secondary bg-opacity-25">
      <h2>404 Not Found</h2>
      <p className="mt-2">找不到頁面</p>
      <NavLink to="/" className="btn btn-secondary rounded-pill px-5 mt-3">回首頁</NavLink>
    </div>
  );
};

export default NotFound;
