import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import greenhouse from "../assets/8607387.jpg";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow h-screen container mx-auto flex flex-col md:flex-row items-center justify-between px-8 py-8">
        {/* Phần Text */}
        <div className="md:w-2/5 text-left">
          <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
            Tận hưởng khu vườn thông minh với{" "}
            <span className="text-green-600">công nghệ AI</span>
          </h1>
          <p className="text-lg text-gray-600 mt-4">
            Hệ thống Smart Garden giúp bạn tự động hóa việc tưới tiêu, giám sát
            độ ẩm, ánh sáng và dinh dưỡng của cây trồng theo thời gian thực.
          </p>
          <button className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow-md">
            Bắt đầu ngay
          </button>
        </div>

        <div className="md:w-3/5 flex justify-center">
          <img
            src={greenhouse}
            alt="Smart Garden"
            className="w-[60%] max-w-[500px] object-contain"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
