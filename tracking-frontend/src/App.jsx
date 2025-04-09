// src/App.jsx
import React, { useEffect, useState } from "react";
import GraphView from "./components/GraphView";
import HeatmapView from "./components/HeatmapView";
import { fetchTrackingData } from "./api";
import "./App.css";

function App() {
  // Modify these time values to cover the desired dataset range.
  // For example, if your dataset spans a minute or more, set appropriate values.
  const [from] = useState(1662896400000);
  const [to] = useState(1662896600000);
  const [data, setData] = useState([]);
  const [metricType, setMetricType] = useState("count"); // "count" or "x_pos"
  const [aggregationInterval, setAggregationInterval] = useState(5000); // in ms

  useEffect(() => {
    fetchTrackingData(from, to)
      .then((fetchedData) => {
        if (Array.isArray(fetchedData)) {
          // Here we use the entire returned array (all entries, e.g., 1000 entries)
          setData(fetchedData);
        } else {
          console.error("Data received is not an array:", fetchedData);
        }
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, [from, to]);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Human Tracking Dashboard</h1>

      <div style={{ textAlign: "center", margin: "20px" }}>
        <label style={{ marginRight: "10px", fontSize: "16px" }}>
          Metric:
        </label>
        <select
          value={metricType}
          onChange={(e) => setMetricType(e.target.value)}
          style={{ padding: "8px", fontSize: "16px", marginRight: "20px" }}
        >
          <option value="count">Number of Humans</option>
          <option value="x_pos">X Position</option>
        </select>

        <label style={{ marginRight: "10px", fontSize: "16px" }}>
          Aggregation Interval:
        </label>
        <select
          value={aggregationInterval}
          onChange={(e) => setAggregationInterval(Number(e.target.value))}
          style={{ padding: "8px", fontSize: "16px" }}
        >
          <option value={1000}>1 second</option>
          <option value={5000}>5 seconds</option>
          <option value={10000}>10 seconds</option>
        </select>
      </div>

      <GraphView
        data={data}
        type={metricType}
        aggregationInterval={aggregationInterval}
      />

      <HeatmapView data={data} type={metricType} />
    </div>
  );
}

export default App;
