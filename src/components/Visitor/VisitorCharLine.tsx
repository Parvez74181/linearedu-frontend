"use client";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import YearPicker from "../YearPicker";
import { useSearchParams } from "next/navigation";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Divider } from "@heroui/react";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const VisitorCharLine = ({ visitorData }: { visitorData: any }) => {
  const searchParams = useSearchParams();

  // Initialize an array for the number of visitors for each month (defaulting to 0)
  const monthlyVisitors = Array(12).fill(0); // 12 months, all initialized to 0

  let totalVisitors = 0;

  // Populate the array based on visitorData
  visitorData.forEach(({ month, total }: { month: string; total: number }) => {
    // Get the index for the month (0-indexed for array, so subtract 1)
    const monthIndex = parseInt(month, 10) - 1;
    monthlyVisitors[monthIndex] = total; // Set the visitor count for the given month
    totalVisitors += +total;
  });

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Yearly Visitor Counter (${searchParams.get("year")}) `,
      },
      datalabels: {
        display: function (context: any) {
          // Only show data labels when hovering over the data point
          return context.hovered;
        },
        align: "center",
        backgroundColor: "rgba(255, 99, 132, 1)",
        color: "white",
        borderRadius: 1,
        font: {
          weight: "bold",
        },
        formatter: (value: any) => value, // Show the number as is
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: `Total Visitors (${totalVisitors})`,
        data: monthlyVisitors, // Use the populated array
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <>
      <YearPicker />
      <Divider className="my-5" />
      <Line options={options as any} data={data} />
    </>
  );
};

export default VisitorCharLine;
