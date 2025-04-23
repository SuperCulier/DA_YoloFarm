import logo from "../assets/forest.png";
import Header from "../components/Header";
import Footer from "../components/Footer";
import greenhouse from "../assets/8607387.jpg";
import { loginUser } from "../apis/LoginAPI";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const result = await loginUser(username, password);
      alert(result.message);

      if (result.success) {
        // localStorage.setItem("user", JSON.stringify(result.user)); 
        navigate("/home"); 
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow h-screen container mx-auto flex flex-col md:flex-row items-center justify-between px-12 py-12 gap-8">
        {/* Phần Text */}
        <div className="w-full md:w-2/5 text-left">
          <div className="w-full max-w-md p-8 bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
              Đăng nhập
            </h1>
            <p className="text-center text-sm text-blue-600 dark:text-blue-500 mb-6">
              Hoặc{" "}
              <a href="#" className="hover:underline">
                Đăng ký tài khoản
              </a>
            </p>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Mật khẩu
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    Ghi nhớ tôi
                  </label>
                </div>
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Quên mật khẩu ?
                </a>
              </div>
              <button
                type="submit"
                className="w-full py-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Đăng nhập
              </button>
            </form>
          </div>
        </div>

        {/* Phần hình minh họa */}
        <div className="w-full md:w-3/5 flex justify-center mt-8 md:mt-0">
          <img
            src={greenhouse}
            alt="Smart Garden"
            className="w-full md:w-[50%] max-w-[500px] object-contain"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
