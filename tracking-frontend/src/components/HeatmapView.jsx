// src/components/HeatmapView.jsx
import React, { useEffect, useRef } from "react";

/**
 * HeatmapView draws a heatmap on a canvas that mimics a graph.
 * It displays a fixed-size (600×250) canvas with clearly marked X and Y axes,
 * including coordinate tick marks and labels.
 * The heatmap visualizes data records (using x and y positions) as mild,
 * overlapping radial gradient circles.
 */
function HeatmapView({ data, type }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // ---------------------------------------
    // 1) SET CANVAS DIMENSIONS (Fixed size)
    // ---------------------------------------
    const totalWidth = 600;
    const totalHeight = 250;
    canvas.width = totalWidth;
    canvas.height = totalHeight;

    // ---------------------------------------
    // 2) DEFINE MARGINS, DRAW AXES & TICKS
    // ---------------------------------------
    const leftMargin = 40;
    const bottomMargin = 30;
    const rightMargin = 20;
    const topMargin = 20;
    const drawableWidth = totalWidth - leftMargin - rightMargin;
    const drawableHeight = totalHeight - topMargin - bottomMargin;

    // Clear and fill background.
    ctx.clearRect(0, 0, totalWidth, totalHeight);
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    // Draw axes.
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.5;
    // Y-axis:
    ctx.beginPath();
    ctx.moveTo(leftMargin, topMargin);
    ctx.lineTo(leftMargin, totalHeight - bottomMargin);
    ctx.stroke();
    // X-axis:
    ctx.beginPath();
    ctx.moveTo(leftMargin, totalHeight - bottomMargin);
    ctx.lineTo(totalWidth - rightMargin, totalHeight - bottomMargin);
    ctx.stroke();

    // Draw axis labels.
    ctx.fillStyle = "#fff";
    ctx.font = "12px sans-serif";
    // X-axis label:
    ctx.fillText("X", totalWidth - rightMargin - 10, totalHeight - bottomMargin + 20);
    // Y-axis label (rotated):
    ctx.save();
    ctx.translate(leftMargin - 25, topMargin + 20);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Y", 0, 0);
    ctx.restore();

    // Draw tick marks and coordinate labels.
    ctx.strokeStyle = "#aaa";
    ctx.fillStyle = "#aaa";
    ctx.font = "10px sans-serif";

    // X-axis ticks
    const xTickCount = 5;
    const xTickSpacing = drawableWidth / xTickCount;
    const scaleFactor = 20; // Must match the scale factor used for plotting data.
    for (let i = 0; i <= xTickCount; i++) {
      const x = leftMargin + i * xTickSpacing;
      // Tick mark (vertical line):
      ctx.beginPath();
      ctx.moveTo(x, totalHeight - bottomMargin);
      ctx.lineTo(x, totalHeight - bottomMargin + 5);
      ctx.stroke();
      // Label below the tick. Compute coordinate value (data value = pixel / scaleFactor).
      const labelValue = (i * xTickSpacing / scaleFactor).toFixed(1);
      ctx.fillText(labelValue, x - 10, totalHeight - bottomMargin + 15);
    }

    // Y-axis ticks
    const yTickCount = 4;
    const yTickSpacing = drawableHeight / yTickCount;
    for (let i = 0; i <= yTickCount; i++) {
      // In canvas, y ticks are drawn from bottom upward.
      const y = totalHeight - bottomMargin - i * yTickSpacing;
      ctx.beginPath();
      ctx.moveTo(leftMargin - 5, y);
      ctx.lineTo(leftMargin, y);
      ctx.stroke();
      const labelValue = (i * yTickSpacing / scaleFactor).toFixed(1);
      // Position the label to the left of the tick.
      ctx.fillText(labelValue, 5, y + 3);
    }

    // ---------------------------------------
    // 3) DRAW HEATMAP DATA
    // ---------------------------------------
    const circleRadius = 20; // Circle radius for each data point.

    // Use "lighter" composite so overlapping circles add intensity.
    ctx.globalCompositeOperation = "lighter";

    // Draw each data record as a radial gradient circle.
    // Coordinates conversion:
    //   canvasX = leftMargin + (pos_x * scaleFactor)
    //   canvasY = (totalHeight - bottomMargin) - (pos_y * scaleFactor)
    data.forEach((record) => {
      const pX = Number(record.pos_x);
      const pY = Number(record.pos_y);
      const canvasX = leftMargin + pX * scaleFactor;
      const canvasY = (totalHeight - bottomMargin) - pY * scaleFactor;
      
      // Determine intensity: for "count" use fixed mild intensity; for "x_pos", use pX scaled.
      let intensity = type === "count" ? 0.15 : Math.min(0.4, Math.max(0.1, pX / 200));
      
      // Create a radial gradient (milder colors):
      const gradient = ctx.createRadialGradient(
        canvasX, canvasY, 0,
        canvasX, canvasY, circleRadius
      );
      // Gradient colors: light blue -> light green -> transparent.
      gradient.addColorStop(0.0, `rgba(0, 128, 255, ${intensity})`);    // Light blue center.
      gradient.addColorStop(0.5, `rgba(0, 255, 128, ${intensity})`);     // Light green.
      gradient.addColorStop(1.0, `rgba(255, 255, 0, 0)`);                // Transparent at edge.

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, circleRadius, 0, 2 * Math.PI);
      ctx.fill();
    });

  }, [data, type]);

  return (
    <div style={{ width: "600px", margin: "20px auto" }}>
      <canvas ref={canvasRef} style={{ display: "block" }} />
    </div>
  );
}

export default HeatmapView;
