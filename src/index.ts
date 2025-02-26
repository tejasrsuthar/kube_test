import type { Request, Response } from "express";
import express from "express";
import axios from "axios";
import { getCurrentDateTime } from "@lib/date";

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 3000;
const SERVICE_HOST = process.env.SERVICE_HOST || `http://localhost:${PORT}`;

// GET /hello - Responds with "world"
app.get("/hello", (req: Request, res: Response) => {
  res.status(200).json({ message: "world" });
});

// GET /status - Calls /hello and returns the status
app.get("/status", async (req: Request, res: Response) => {
  try {
    console.log("getCurrentDateTime:", getCurrentDateTime());
    const response = await axios.get(`${SERVICE_HOST}/hello`);
    res.json({ status: "ok", message: response.data });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Failed to reach /hello" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
