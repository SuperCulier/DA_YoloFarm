import React, { useEffect } from "react";
import ApexCharts from "apexcharts";

export default function ChartComponent() {
  useEffect(() => {
    const options = {
      chart: {
        height: 380,
        maxWidth: 680,
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
          data: [
            [new Date().setHours(0, 0, 0, 0), 30],
            [new Date().setHours(3, 0, 0, 0), 32],
            [new Date().setHours(6, 0, 0, 0), 31],
            [new Date().setHours(9, 0, 0, 0), 33],
            [new Date().setHours(12, 0, 0, 0), 34],
            [new Date().setHours(15, 0, 0, 0), 35],
            [new Date().setHours(18, 0, 0, 0), 36],
          ],
          color: "#FF5733",
        },
        {
          name: "Độ ẩm không khí (%)",
          data: [
            [new Date().setHours(0, 0, 0, 0), 60],
            [new Date().setHours(3, 0, 0, 0), 65],
            [new Date().setHours(6, 0, 0, 0), 62],
            [new Date().setHours(9, 0, 0, 0), 66],
            [new Date().setHours(12, 0, 0, 0), 68],
            [new Date().setHours(15, 0, 0, 0), 70],
            [new Date().setHours(18, 0, 0, 0), 72],
          ],
          color: "#3498DB",
        },
        {
          name: "Độ ẩm đất (%)",
          data: [
            [new Date().setHours(0, 0, 0, 0), 40],
            [new Date().setHours(3, 0, 0, 0), 42],
            [new Date().setHours(6, 0, 0, 0), 41],
            [new Date().setHours(9, 0, 0, 0), 43],
            [new Date().setHours(12, 0, 0, 0), 45],
            [new Date().setHours(15, 0, 0, 0), 47],
            [new Date().setHours(18, 0, 0, 0), 50],
          ],
          color: "#2ECC71",
        },
        {
          name: "Ánh sáng (Lux)",
          data: [
            [new Date().setHours(0, 0, 0, 0), 15],
            [new Date().setHours(3, 0, 0, 0), 17],
            [new Date().setHours(6, 0, 0, 0), 23],
            [new Date().setHours(9, 0, 0, 0), 22],
            [new Date().setHours(12, 0, 0, 0), 22],
            [new Date().setHours(15, 0, 0, 0), 25],
            [new Date().setHours(18, 0, 0, 0), 21],
          ],
          color: "#FFFF00",
        },
      ],
      legend: { show: true, position: "top" },
      xaxis: {
        type: "datetime",
        min: new Date().setHours(0, 0, 0, 0), // 00:00 hôm nay
        max: new Date().setHours(23, 59, 59, 999), // 23:59 hôm nay
        labels: {
          datetimeFormatter: {
            hour: "HH:mm",
          },
          formatter: (value) => {
            const date = new Date(value);
            return date.getHours() + "h"; // Hiển thị giờ (0h, 2h, 4h, ...)
          },
        },
        tickAmount: 12, // Chia 24h thành các điểm 2h một lần
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

      return () => {
        chart.destroy(); // Cleanup khi component unmount
      };
    }
  }, []);

  return (
    <div
      id="line-chart"
      className="w-full h-full border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
    ></div>
  ); 
}
