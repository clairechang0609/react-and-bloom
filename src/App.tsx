import { RouterProvider } from "react-router";
import routes from "./routes/index";
import AlertToast from './components/Toast';

const App = () => {
  return (
    <>
      <RouterProvider router={routes} />
      <AlertToast />
    </>
  );
};

export default App;
