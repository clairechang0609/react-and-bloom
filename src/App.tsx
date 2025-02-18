import { RouterProvider } from "react-router";
import FullPageLoading from './components/FullPageLoading';
import AlertToast from './components/Toast';
import routes from "./routes/index";

const App = () => {
  return (
    <>
      <RouterProvider router={routes} />
      <AlertToast />
      <FullPageLoading />
    </>
  );
};

export default App;
