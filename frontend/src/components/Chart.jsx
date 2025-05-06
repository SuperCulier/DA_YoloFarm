import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

export default function Chart({ weatherData, selectedTab, chartData }) {
  const chartRef = useRef(null);

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
        min:
          selectedTab === "Ngày"
            ? chartData.length
              ? new Date(chartData[0].timestamp).setUTCHours(0, 0, 0, 0) // Use UTC
              : new Date().setUTCHours(0, 0, 0, 0)
            : selectedTab === "Tuần"
            ? weatherData.rawTimestamp
              ? new Date(
                  new Date(weatherData.rawTimestamp).setDate(
                    new Date(weatherData.rawTimestamp).getDate() -
                      new Date(weatherData.rawTimestamp).getDay()
                  )
                ).setHours(0, 0, 0, 0)
              : new Date(
                  new Date().setDate(new Date().getDate() - new Date().getDay())
                ).setHours(0, 0, 0, 0)
            : weatherData.rawTimestamp
            ? new Date(
                new Date(weatherData.rawTimestamp).getFullYear(),
                new Date(weatherData.rawTimestamp).getMonth(),
                1
              ).setHours(0, 0, 0, 0)
            : new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                1
              ).setHours(0, 0, 0, 0),
        max:
          selectedTab === "Ngày"
            ? chartData.length
              ? new Date(chartData[0].timestamp).setUTCHours(23, 59, 59, 999) // Use UTC
              : new Date().setUTCHours(23, 59, 59, 999)
            : selectedTab === "Tuần"
            ? weatherData.rawTimestamp
              ? new Date(
                  new Date(weatherData.rawTimestamp).setDate(
                    new Date(weatherData.rawTimestamp).getDate() -
                      new Date(weatherData.rawTimestamp).getDay() +
                      6
                  )
                ).setHours(23, 59, 59, 999)
              : new Date(
                  new Date().setDate(
                    new Date().getDate() - new Date().getDay() + 6
                  )
                ).setHours(23, 59, 59, 999)
            : weatherData.rawTimestamp
            ? new Date(
                new Date(weatherData.rawTimestamp).getFullYear(),
                new Date(weatherData.rawTimestamp).getMonth() + 1,
                0
              ).setHours(23, 59, 59, 999)
            : new Date(
                new Date().getFullYear(),
                new Date().getMonth() + 1,
                0
              ).setHours(23, 59, 59, 999),
        labels: {
          datetimeFormatter: {
            hour: "HH:mm",
            day: "dd/MM",
            month: "MM/yyyy",
          },
          formatter: (value) => {
            const date = new Date(value);
            if (selectedTab === "Ngày") {
              return date.getUTCHours() + "h"; // Use UTC hours to match timestamps
            } else if (selectedTab === "Tuần") {
              return date.getUTCDate() + "/" + (date.getUTCMonth() + 1);
            } else {
              return date.getUTCDate() + "/" + (date.getUTCMonth() + 1);
            }
          },
        },
        tickAmount:
          selectedTab === "Ngày" ? 12 : selectedTab === "Tuần" ? 7 : 10,
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
  }, [weatherData, selectedTab, chartData]); // Include chartData in dependencies

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

  return <div id="line-chart" className="w-full h-full"></div>;
}
