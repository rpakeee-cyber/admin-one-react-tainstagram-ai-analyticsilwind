"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { Reel } from "../../../../src/types";
import { formatDate } from "../../../../src/utils/analytics";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

type Props = {
  reels: Reel[];
};

export default function PerformanceChart({ reels }: Props) {
  const orderedReels = [...reels].reverse();
  const data = {
    labels: orderedReels.map((reel) => formatDate(reel.publishedAt)),
    datasets: [
      {
        label: "Просмотры",
        data: orderedReels.map((reel) => reel.views),
        borderColor: "#c026d3",
        backgroundColor: "rgba(192, 38, 211, 0.12)",
        pointBackgroundColor: "#c026d3",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="h-72">
      <Line
        data={data}
        options={{
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: "#94a3b8" },
              border: { display: false },
            },
            y: {
              beginAtZero: true,
              grid: { color: "rgba(148, 163, 184, 0.14)" },
              ticks: {
                color: "#94a3b8",
                callback: (value) => `${Number(value) / 1000}K`,
              },
              border: { display: false },
            },
          },
        }}
      />
    </div>
  );
}
