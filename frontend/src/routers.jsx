import Device from "./pages/Device/Device.jsx";
import ErrorPage from "./pages/Error.jsx";
import Weather from "./pages/Garden/Weather.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />, 
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
  {
    path: "/weather",
    element: <Weather />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/device",
    element: <Device />,
    errorElement: <ErrorPage />,
  },
]);

