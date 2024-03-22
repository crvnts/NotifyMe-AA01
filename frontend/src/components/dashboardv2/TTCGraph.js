import Typography from "antd/es/typography/Typography";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const TTCGraph = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Average Delays per Hour",
        data: [],
        backgroundColor: "rgba(54, 162, 235, 1)",
        borderColor: "rgba(0, 0, 0, 1)",
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchDelayData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/getSubwayDelayData"
        );
        const delaysPerHour = response.data["average delays"];

        // Parse the JSON strings and extract the hour and Avg_Delay_Occurrences_Per_Hour
        const hours = delaysPerHour.map((item) => `${item[1]}:00`);
        const avgDelays = delaysPerHour.map((item) => {
          // Parse the JSON string into an object
          const delayData = JSON.parse(item[2].replace(/'/g, '"'));
          return delayData.Avg_Delay_Occurrences_Per_Hour;
        });

        setChartData({
          labels: hours,
          datasets: [
            {
              ...chartData.datasets[0],
              data: avgDelays,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching the delay data:", error);
      }
    };

    fetchDelayData();
  }, []);

  return (
    <div>
      <Typography style={{ textAlign: "center", marginBottom: "20px" }}>
        Projected TTC subway delays in Toronto
      </Typography>
      <Bar data={chartData} />
    </div>
  );
};

export default TTCGraph;
