import { Router } from "express";
import {
  getAllTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getAllUsers,
} from "../controllers/task.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  requireRole,
  canModifyTask,
  canUpdateTaskStatus,
} from "../middlewares/rbac.middleware.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// Get users for task assignment (admin only)
router.get("/users", requireRole("admin"), getAllUsers);

// Task routes

// All authenticated users can view their tasks
router.get("/", getAllTasks); 
// Only admin can create tasks
router.post("/", requireRole("admin"), createTask); 
// Only admin can fully update tasks
router.put("/:id", canModifyTask, updateTask); 
// Users can update status of assigned tasks
router.patch("/:id/status", canUpdateTaskStatus, updateTaskStatus);
// Only admin can delete tasks
router.delete("/:id", requireRole("admin"), deleteTask); 

export default router;
