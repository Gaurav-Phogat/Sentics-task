// src/components/GraphView.jsx
import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function GraphView({ data, type, aggregationInterval }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div style={{ textAlign: "center", margin: "20px" }}>
        No data available for graph
      </div>
    );
  }

  // Use the full dataset for grouping.
  const bucket = Number(aggregationInterval) || 5000; // default aggregation interval: 5000 ms
  const grouped = data.reduce((acc, record) => {
    const ts = Number(record.timestamp);
    // Determine the start of the bucket for this record.
    const bucketTime = Math.floor(ts / bucket) * bucket;
    if (!acc[bucketTime]) {
      acc[bucketTime] = [];
    }
    acc[bucketTime].push(record);
    return acc;
  }, {});

  // Get sorted bucket times (all keys).
  const sortedTimestamps = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => a - b);

  // Create labels from bucket start times.
  const labels = sortedTimestamps.map((ts) =>
    new Date(ts).toLocaleTimeString()
  );

  // Compute metric per bucket.
  let metricData = [];
  if (type === "count") {
    metricData = sortedTimestamps.map((ts) => grouped[ts].length);
  } else if (type === "x_pos") {
    metricData = sortedTimestamps.map((ts) => {
      const records = grouped[ts];
      if (records.length === 0) return 0;
      const total = records.reduce(
        (sum, rec) => sum + (Number(rec.pos_x) || 0),
        0
      );
      return total / records.length;
    });
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: type === "count" ? "Number of Humans" : "Average X Position",
        data: metricData,
        borderColor: type === "count" ? "blue" : "green",
        fill: false,
      },
    ],
  };

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto" }}>
      <Line data={chartData} options={{ responsive: true }} />
    </div>
  );
}

export default GraphView;
