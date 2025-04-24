import { RouterProvider } from "react-router-dom";
import { router } from "./routers.jsx"; 
import "flowbite/dist/flowbite.css";
import "flowbite";
import { AuthProvider } from './AuthContext';

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
