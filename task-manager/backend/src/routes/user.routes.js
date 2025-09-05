import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/rbac.middleware.js";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
} from "../controllers/user.controller.js";

const router = Router();

// Apply authentication middleware to all user routes
router.use(verifyToken);

// Apply admin authorization to all user management routes
router.use(requireAdmin);

// User management routes (admin only)
router.get("/", getAllUsers);
router.post("/", createUser);
router.get("/stats", getUserStats);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
