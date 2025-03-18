import SideBar from "../../components/SideBar.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSeedling, faTemperatureHalf, faWind } from "@fortawesome/free-solid-svg-icons";
import Chart from "../../components/Chart.jsx";

export default function Weather() {
  return (
    <>
      <SideBar />
      <div className="p-4 sm:ml-64">
        {/* Tabs chọn thời gian */}
        <div className="text-sm font-medium text-center text-gray-500 dark:text-gray-500">
          <ul className="flex flex-wrap justify-center -mb-px">
            {["Ngày", "Tuần", "Tháng"].map((label, index) => (
              <li key={label} className="me-2">
                <a
                  href="#"
                  className={`inline-block p-4 border-b-2 ${
                    index === 0
                      ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500 text-xl"
                      : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 text-xl"
                  } rounded-t-lg`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Grid layout: Weather Card + Biểu đồ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Weather Card */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-md mb-2 px-4 pt-4">
              <div className="flex justify-between">
                <span className="text-lg font-regular">Vườn 1</span>
                <span className="text-lg font-regular">6:13</span>
              </div>
            </h2>

            {/* Icon Nhiệt độ */}
            <div className="flex items-center justify-center p-4">
              <FontAwesomeIcon icon={faTemperatureHalf} size="6x" className="text-gray-700" />
            </div>

            {/* Độ ẩm và nhiệt độ */}
            <div className="pt-4 px-4">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <span className="flex space-x-2 items-center">
                    <FontAwesomeIcon icon={faWind} size="2x" className="text-gray-600" />
                    <span className="text-xl font-medium text-gray-700">27%</span>
                  </span>
                  <span className="flex space-x-2 items-center">
                    <FontAwesomeIcon icon={faSeedling} size="2x" className="text-gray-600" />
                    <span className="text-xl font-medium text-gray-700">32%</span>
                  </span>
                </div>
                <h1 className="text-7xl font-medium text-gray-700">12°</h1>
              </div>
            </div>
          </div>

          {/* Biểu đồ theo dõi nhiệt độ, độ ẩm trong ngày */}
          <div className="col-span-2">
            <Chart />
          </div>
        </div>
      </div>
    </>
  );
}
