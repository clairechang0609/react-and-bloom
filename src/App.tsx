import { RouterProvider } from "react-router";
import routes from "./routes/index";

const App = () => {
  return <RouterProvider router={routes} />;
};

export default App;
