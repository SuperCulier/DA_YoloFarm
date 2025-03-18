import { RouterProvider } from "react-router-dom";
import { router } from "./routers.jsx"; 
import "flowbite/dist/flowbite.css";
import "flowbite";


function App() {
  return <RouterProvider router={router} />; 
}

export default App;
