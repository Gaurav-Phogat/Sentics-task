// src/api.js
import axios from "axios";

export const fetchTrackingData = async (from, to) => {
  const response = await axios.get("http://localhost:5000/data", {
    params: { from, to },
  });
  return response.data;
};
