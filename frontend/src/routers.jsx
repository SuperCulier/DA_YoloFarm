import Device from "./pages/Device/Device.jsx";
import ErrorPage from "./pages/Error.jsx";
import Weather from "./pages/Garden/Weather.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Setting from "./pages/Setting.jsx";
import User from "./pages/User.jsx";
import { createBrowserRouter, Navigate } from "react-router-dom"; // Add Navigate import
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const ProtectedRouteWrapper = ({ element }) => (
  <ProtectedRoute>{element}</ProtectedRoute>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" replace />,
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
    element: <ProtectedRouteWrapper element={<Weather />} />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/device",
    element: <ProtectedRouteWrapper element={<Device />} />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/setting",
    element: <Setting />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/user",
    element: <User />,
    errorElement: <ErrorPage />,
  },
]);
