import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import Typography from "antd/es/typography/Typography";
import "./TTCGraph.css";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const TTCGraph = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Average Delays per Hour",
        data: [],
      },
    ],
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: "#fefefe"
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: "#fefefe"
        },
        grid: {
          borderDash: [8, 4],
          color: '#3b4c65'
        }
      }
    },
    elements: {
      bar: {
        borderRadius: 10, // Rounded corners for the bars
        backgroundColor: "#533cf5", // Soft background color for the bars
        borderColor: '#bbc9dd', // Border color similar to the background for a subtle edge
        borderWidth: 0,
      }
    },
    plugins: {
      legend: {
        labels: {
          boxWidth: 12,
          color: '#fefefe', // Soft text color for legend labels
        }
      },
      tooltip: {
        // You can add neumorphic styling to the tooltip as well
        backgroundColor: '#E0E5EC', // Soft color for tooltip background
        titleColor: '#495057', // Color for tooltip title
        bodyColor: '#495057', // Color for tooltip body
        cornerRadius: 20,
        borderColor: '#E0E5EC',
        borderWidth: 1,
      }
    }

  };

  useEffect(() => {
    const fetchDelayData = async () => {
      try {
        const response = await axios.get(
          "https://notifyme-aa01-r4ro.onrender.com/api/getSubwayDelayData"
        );
        const delaysPerHour = response.data["average delays"];
        const hours = delaysPerHour.map((item) => `${item[1]}:00`);
        const avgDelays = delaysPerHour.map(
          (item) =>
            JSON.parse(item[2].replace(/'/g, '"'))
              .Avg_Delay_Occurrences_Per_Hour
        );

        setChartData((prevChartData) => ({
          ...prevChartData,
          labels: hours,
          datasets: [
            {
              ...prevChartData.datasets[0],
              data: avgDelays,
            },
          ],
        }));
      } catch (error) {
        console.error("Error fetching the delay data:", error);
      }
    };

    fetchDelayData();
  }, []);

  return (
    <div className="chart-container">
      <Typography style={{ textAlign: "center", fontFamily: "Zen Maru Gothic", fontSize: "14pt", color: "#FEFEFE" }}>
        Projected TTC subway delays in Toronto
      </Typography>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default TTCGraph;
