import express from "express";
import cors from "cors";
import fs from "fs";
import pool from "./db.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Load dataset
const rawData = JSON.parse(fs.readFileSync("./data.json", "utf-8"));

// Simulate feed
let currentIndex = 0;

function insertNext() {
  if (currentIndex >= rawData.length) return;

  const entry = rawData[currentIndex++];
  const timestamp = Number(entry.timestamp);


  const instances = Object.values(entry.instances);

  instances.forEach(async (instance, idx) => {
    await pool.query(
      `INSERT INTO human_tracking (human_id, timestamp, pos_x, pos_y, vel_x, vel_y, confidence)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [idx, timestamp, instance.pos_x, instance.pos_y, instance.vel_x, instance.vel_y, instance.confidence]
    );
  });

  setTimeout(insertNext, 10); // simulate 1 sec delay
}

insertNext();

// API to get data by timestamp range
app.get("/data", async (req, res) => {
  const { from, to } = req.query;
  const data = await pool.query(
    `SELECT * FROM human_tracking WHERE timestamp BETWEEN $1 AND $2 ORDER BY timestamp`,
    [from, to]
  );
  res.json(data.rows);
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
