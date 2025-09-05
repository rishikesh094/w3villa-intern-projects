import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.js";
import taskRoutes from "./routes/task.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// API routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

export default app;
