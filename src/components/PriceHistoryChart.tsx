import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary components
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PriceHistoryProps {
  priceHistory: { date: string; price: number }[];
}

const PriceHistoryChart: React.FC<PriceHistoryProps> = ({ priceHistory }) => {
  const dates = priceHistory.map((item) => item.date);
  const prices = priceHistory.map((item) => item.price);

  const data = {
    labels: dates,
    datasets: [
      {
        label: "Price Over Time",
        data: prices,
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Price History",
      },
    },
    scales: {
      x: {
        type: "category",
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "Price",
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default PriceHistoryChart;
