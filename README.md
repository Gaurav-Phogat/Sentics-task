# Human Tracking Dashboard

This project is a full-stack application designed to visualize time-stamped human tracking data in both graphical and spatial formats. It consists of a backend service that processes location data stored in a PostgreSQL database, and a frontend interface that visualizes this data using a time-series line graph and a spatial heatmap.

---

## Project Overview

The dashboard provides a clear overview of how many individuals are being tracked over time and where they are located in a given space. For the purpose of this project, we are working with a subset of **1,000 data entries**.

Key features include:

- A time-based line graph showing either the number of individuals or their average X position.
- A heatmap representing physical positions using `pos_x` and `pos_y` coordinates.
- Adjustable time aggregation intervals for custom temporal analysis.
- A frontend built with React and a backend built with Node.js and PostgreSQL.
- Environment variables are used to manage sensitive configuration such as database credentials.

---

## Technologies Used

**Frontend:**
- React (Vite)
- Chart.js (for the line graph)
- Canvas API (custom heatmap rendering)

**Backend:**
- Node.js with Express
- PostgreSQL for data storage
- dotenv for secure configuration management

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/human-tracking-dashboard.git
cd human-tracking-dashboard
```

---

### 2. Backend Setup

#### a. Install Dependencies

```bash
cd backend
npm install
```

#### b. Configure Environment Variables

Create a `.env` file in the `backend` directory with your PostgreSQL credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
```

> Sensitive information like database passwords is stored in the `.env` file and not hardcoded into the backend codebase.

#### c. Start the Backend Server

```bash
node index.js
```

Ensure that your PostgreSQL service is running before starting the server.

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

The frontend will be available at [http://localhost:5173](http://localhost:5173).

---

## Dashboard Features

### Line Graph

- Displays data aggregated by time interval.
- Select between total human count or average X coordinate per interval.
- Supports configurable aggregation durations (e.g., 1s, 5s, 10s).

### Heatmap

- Renders a heatmap of spatial data (`pos_x`, `pos_y`) using a custom canvas.
- Milder gradients are used for clarity.
- Includes labeled X and Y axes with coordinate ticks.

---

## Database Schema

Example schema for storing the subset of 1,000 records:

```sql
CREATE TABLE human_tracking (
    id SERIAL PRIMARY KEY,
    timestamp BIGINT NOT NULL,
    pos_x FLOAT NOT NULL,
    pos_y FLOAT NOT NULL,
    vel_x FLOAT,
    vel_y FLOAT,
    confidence FLOAT,
    human_id INT
);
```

---

## Notes

- The dataset used is a parsed and pre-processed subset of 1,000 rows for performance and clarity.
- Bulk insertion scripts must ensure correct field formatting and error handling.
- Do not commit the `.env` file to version control.

---

## License

This project is licensed under the MIT License.