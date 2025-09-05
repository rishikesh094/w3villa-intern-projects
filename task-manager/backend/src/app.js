import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import taskRoutes from "./routes/task.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// API routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

export default app;
