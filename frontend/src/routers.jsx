import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ErrorPage from "./pages/Error.jsx";
import Weather from "./pages/Garden/Weather.jsx";
import Login from "./pages/Login.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
  {
    path: "/weather",
    element: <Weather />,
    errorElement: <ErrorPage />
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />
  }
]);
