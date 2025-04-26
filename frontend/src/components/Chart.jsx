// import React, { useEffect } from "react";
// import ApexCharts from "apexcharts";

// export default function ChartComponent() {
//   useEffect(() => {
//     const options = {
//       chart: {
//         height: 380,
//         maxWidth: 680,
//         type: "line",
//         fontFamily: "Inter, sans-serif",
//         dropShadow: { enabled: false },
//         toolbar: { show: false },
//       },
//       tooltip: { enabled: true, x: { show: false } },
//       dataLabels: { enabled: false },
//       stroke: { width: 4, curve: "smooth" },
//       grid: {
//         show: true,
//         strokeDashArray: 8,
//         padding: { left: 2, right: 2, top: -26 },
//       },
//       series: [
//         {
//           name: "Nhiệt độ (°C)",
//           data: [
//             [new Date().setHours(0, 0, 0, 0), 30],
//             [new Date().setHours(3, 0, 0, 0), 32],
//             [new Date().setHours(6, 0, 0, 0), 31],
//             [new Date().setHours(9, 0, 0, 0), 33],
//             [new Date().setHours(12, 0, 0, 0), 34],
//             [new Date().setHours(15, 0, 0, 0), 35],
//             [new Date().setHours(18, 0, 0, 0), 36],
//           ],
//           color: "#FF5733",
//         },
//         {
//           name: "Độ ẩm không khí (%)",
//           data: [
//             [new Date().setHours(0, 0, 0, 0), 60],
//             [new Date().setHours(3, 0, 0, 0), 65],
//             [new Date().setHours(6, 0, 0, 0), 62],
//             [new Date().setHours(9, 0, 0, 0), 66],
//             [new Date().setHours(12, 0, 0, 0), 68],
//             [new Date().setHours(15, 0, 0, 0), 70],
//             [new Date().setHours(18, 0, 0, 0), 72],
//           ],
//           color: "#3498DB",
//         },
//         {
//           name: "Độ ẩm đất (%)",
//           data: [
//             [new Date().setHours(0, 0, 0, 0), 40],
//             [new Date().setHours(3, 0, 0, 0), 42],
//             [new Date().setHours(6, 0, 0, 0), 41],
//             [new Date().setHours(9, 0, 0, 0), 43],
//             [new Date().setHours(12, 0, 0, 0), 45],
//             [new Date().setHours(15, 0, 0, 0), 47],
//             [new Date().setHours(18, 0, 0, 0), 50],
//           ],
//           color: "#2ECC71",
//         },
//       ],
//       legend: { show: true, position: "top" },
//       xaxis: {
//         type: "datetime",
//         min: new Date().setHours(0, 0, 0, 0), // 00:00 hôm nay
//         max: new Date().setHours(23, 59, 59, 999), // 23:59 hôm nay
//         labels: {
//           datetimeFormatter: {
//             hour: "HH:mm",
//           },
//           formatter: (value) => {
//             const date = new Date(value);
//             return date.getHours() + "h"; // Hiển thị giờ (0h, 2h, 4h, ...)
//           },
//         },
//         tickAmount: 12, // Chia 24h thành các điểm 2h một lần
//       },
//       yaxis: {
//         labels: {
//           show: true,
//           style: {
//             fontFamily: "Inter, sans-serif",
//             cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
//           },
//         },
//       },
//     };

//     const chartElement = document.getElementById("line-chart");
//     if (chartElement) {
//       const chart = new ApexCharts(chartElement, options);
//       chart.render();

//       return () => {
//         chart.destroy(); // Cleanup khi component unmount
//       };
//     }
//   }, []);

//   return (
//     <div
//       id="line-chart"
//       className="w-full h-full border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
//     ></div>
//   ); 
// }
import React, { useEffect, useState, useRef } from "react";
import ApexCharts from "apexcharts";
import { getWeatherHourly } from "../apis/WeatherAPI.js"; // Adjust the import path

export default function Chart({ weatherData, selectedTab }) {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef(null);

  const fetchData = async () => {
    if (!weatherData.rawTimestamp) return;

    try {
      const baseDate = new Date(weatherData.rawTimestamp);
      let startDateStr;

      // Adjust the date range based on the selected tab
      if (selectedTab === "Ngày") {
        startDateStr = baseDate.toISOString().split("T")[0] + "T00:00:00";
      } else if (selectedTab === "Tuần") {
        const startOfWeek = new Date(baseDate);
        startOfWeek.setDate(baseDate.getDate() - baseDate.getDay());
        startDateStr = startOfWeek.toISOString().split("T")[0] + "T00:00:00";
      } else if (selectedTab === "Tháng") {
        const startOfMonth = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
        startDateStr = startOfMonth.toISOString().split("T")[0] + "T00:00:00";
      }

      const data = await getWeatherHourly(startDateStr);

      if (data) {
        console.log("Fetched hourly data for chart:", data);
        const processedData = Object.entries(data).map(([hour, values]) => {
          const timestamp = new Date(startDateStr);
          timestamp.setHours(parseInt(hour), 0, 0, 0);
          return {
            timestamp: timestamp.toISOString(),
            temperature: values.temperature,
            humidity: values.humidity,
            soilMoisture: values.soil_moisture,
            lux: values.lux,
          };
        });

        setChartData((prevData) => {
          const existingTimestamps = new Set(prevData.map((point) => point.timestamp));
          const newDataPoints = processedData.filter(
            (point) => !existingTimestamps.has(point.timestamp)
          );
          return [...prevData, ...newDataPoints];
        });
      } else {
        console.log("No data returned from getWeatherHourly");
      }
    } catch (error) {
      console.error("Failed to fetch hourly chart data:", error);
    }
  };

  useEffect(() => {
    if (weatherData.rawTimestamp) {
      fetchData().then(() => setIsLoading(false));
    }
  }, [weatherData, selectedTab]); // Re-fetch when weatherData or selectedTab changes

  useEffect(() => {
    const options = {
      chart: {
        height: 380,
        maxWidth: "100%",
        type: "line",
        fontFamily: "Inter, sans-serif",
        dropShadow: { enabled: false },
        toolbar: { show: false },
      },
      tooltip: { enabled: true, x: { show: false } },
      dataLabels: { enabled: false },
      stroke: { width: 4, curve: "smooth" },
      grid: {
        show: true,
        strokeDashArray: 8,
        padding: { left: 2, right: 2, top: -26 },
      },
      series: [
        {
          name: "Nhiệt độ (°C)",
          data: [],
          color: "#FF5733",
        },
        {
          name: "Độ ẩm không khí (%)",
          data: [],
          color: "#3498DB",
        },
        {
          name: "Độ ẩm đất (%)",
          data: [],
          color: "#2ECC71",
        },
        {
          name: "Ánh sáng (lux)",
          data: [],
          color: "#F1C40F",
        },
      ],
      legend: { show: true, position: "top" },
      xaxis: {
        type: "datetime",
        min: selectedTab === "Ngày"
          ? weatherData.rawTimestamp
            ? new Date(weatherData.rawTimestamp).setHours(0, 0, 0, 0)
            : new Date().setHours(0, 0, 0, 0)
          : selectedTab === "Tuần"
          ? weatherData.rawTimestamp
            ? new Date(new Date(weatherData.rawTimestamp).setDate(new Date(weatherData.rawTimestamp).getDate() - new Date(weatherData.rawTimestamp).getDay())).setHours(0, 0, 0, 0)
            : new Date(new Date().setDate(new Date().getDate() - new Date().getDay())).setHours(0, 0, 0, 0)
          : weatherData.rawTimestamp
          ? new Date(new Date(weatherData.rawTimestamp).getFullYear(), new Date(weatherData.rawTimestamp).getMonth(), 1).setHours(0, 0, 0, 0)
          : new Date(new Date().getFullYear(), new Date().getMonth(), 1).setHours(0, 0, 0, 0),
        max: selectedTab === "Ngày"
          ? weatherData.rawTimestamp
            ? new Date(weatherData.rawTimestamp).setHours(23, 59, 59, 999)
            : new Date().setHours(23, 59, 59, 999)
          : selectedTab === "Tuần"
          ? weatherData.rawTimestamp
            ? new Date(new Date(weatherData.rawTimestamp).setDate(new Date(weatherData.rawTimestamp).getDate() - new Date(weatherData.rawTimestamp).getDay() + 6)).setHours(23, 59, 59, 999)
            : new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 6)).setHours(23, 59, 59, 999)
          : weatherData.rawTimestamp
          ? new Date(new Date(weatherData.rawTimestamp).getFullYear(), new Date(weatherData.rawTimestamp).getMonth() + 1, 0).setHours(23, 59, 59, 999)
          : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).setHours(23, 59, 59, 999),
        labels: {
          datetimeFormatter: {
            hour: "HH:mm",
            day: "dd/MM",
            month: "MM/yyyy",
          },
          formatter: (value) => {
            const date = new Date(value);
            if (selectedTab === "Ngày") {
              return date.getHours() + "h";
            } else if (selectedTab === "Tuần") {
              return date.getDate() + "/" + (date.getMonth() + 1);
            } else {
              return date.getDate() + "/" + (date.getMonth() + 1);
            }
          },
        },
        tickAmount: selectedTab === "Ngày" ? 12 : selectedTab === "Tuần" ? 7 : 10,
      },
      yaxis: {
        labels: {
          show: true,
          style: {
            fontFamily: "Inter, sans-serif",
            cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
          },
        },
      },
    };

    const chartElement = document.getElementById("line-chart");
    if (chartElement) {
      const chart = new ApexCharts(chartElement, options);
      chart.render();
      chartRef.current = chart;

      return () => {
        chart.destroy();
      };
    }
  }, [weatherData, selectedTab]);

  useEffect(() => {
    if (!chartData || chartData.length === 0 || !chartRef.current) return;

    const seriesData = [
      {
        name: "Nhiệt độ (°C)",
        data: chartData.map((point) => [
          new Date(point.timestamp).getTime(),
          point.temperature,
        ]),
      },
      {
        name: "Độ ẩm không khí (%)",
        data: chartData.map((point) => [
          new Date(point.timestamp).getTime(),
          point.humidity,
        ]),
      },
      {
        name: "Độ ẩm đất (%)",
        data: chartData.map((point) => [
          new Date(point.timestamp).getTime(),
          point.soilMoisture,
        ]),
      },
      {
        name: "Ánh sáng (lux)",
        data: chartData.map((point) => [
          new Date(point.timestamp).getTime(),
          point.lux,
        ]),
      },
    ];

    console.log("Updating chart with series data:", seriesData);
    chartRef.current.updateSeries(seriesData, true);
  }, [chartData]);

  if (isLoading) {
    return <div className="text-center text-gray-500 dark:text-gray-400">Đang tải dữ liệu...</div>;
  }

  if (!chartData || chartData.length === 0) {
    return <div className="text-center text-gray-500 dark:text-gray-400">Không có dữ liệu để hiển thị</div>;
  }

  return <div id="line-chart" className="w-full h-full"></div>;
}
