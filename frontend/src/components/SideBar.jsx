import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faUser,
  faScrewdriverWrench,
  faSun,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/forest.png";
import { useAuth } from "../AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GET_THRESHOLD_ALERT_API } from "../apis/apis";

export default function SideBar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  const [wsError, setWsError] = useState(null);

  useEffect(() => {
    if (!user) return;

    let socket;
    let retryCount = 0;
    const maxRetries = 5;
    const retryDelay = 5000;

    const connectWebSocket = () => {
      socket = new WebSocket(GET_THRESHOLD_ALERT_API);

      socket.onopen = () => {
        console.log("WebSocket connection opened");
        setWsError(null);
        retryCount = 0;
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === "alert") {
            console.log("Received alert:", message.data);
            setUnreadCount((prev) => prev + 1);
          }
        } catch (e) {
          console.error("Invalid message:", event.data, e);
        }
      };

      socket.onerror = (error) => {
        console.error(
          "WebSocket error:",
          error,
          "URL:",
          GET_THRESHOLD_ALERT_API
        );
        setWsError("Failed to connect to alert service. Retrying...");
      };

      socket.onclose = (event) => {
        console.log("WebSocket closed:", {
          code: event.code,
          reason: event.reason,
        });
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying connection (${retryCount}/${maxRetries})...`);
          setTimeout(connectWebSocket, retryDelay);
        } else {
          setWsError("Unable to connect to alerts. Please try again later.");
        }
      };
    };

    connectWebSocket();

    return () => {
      if (socket) socket.close();
    };
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleUserClick = () => {
    navigate("/user");
    setUnreadCount(0);
  };

  return (
    <>
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="/weather"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <FontAwesomeIcon icon={faSun} className="text-gray-600" />
                <span className="ms-3 text-gray-700">Thời tiết</span>
              </a>
            </li>
            <li>
              <a
                href="/device"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <FontAwesomeIcon
                  icon={faScrewdriverWrench}
                  className="text-gray-600"
                />
                <span className="flex-1 ms-3 whitespace-nowrap text-gray-700">
                  Điều khiển
                </span>
              </a>
            </li>
            <li>
              <a
                href="/setting"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <FontAwesomeIcon icon={faGear} className="text-gray-600" />
                <span className="flex-1 ms-3 whitespace-nowrap text-gray-700">
                  Cài đặt
                </span>
              </a>
            </li>
            <li>
              <button
                onClick={handleUserClick}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group w-full text-left"
              >
                <FontAwesomeIcon icon={faUser} className="text-gray-600" />
                <span className="flex-1 ms-3 whitespace-nowrap text-gray-700">
                  Người dùng
                </span>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group w-full text-left"
              >
                <FontAwesomeIcon
                  icon={faArrowRightFromBracket}
                  className="text-gray-600"
                />
                <span className="flex-1 ms-3 whitespace-nowrap text-gray-700">
                  Đăng xuất
                </span>
              </button>
            </li>
          </ul>
          <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
            <li>
              <a href="/" className="flex items-center">
                <img src={logo} className="mr-3 h-6 sm:h-9" alt="Logo" />
                <span className="text-gray-700 self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                  Smart Garden
                </span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
