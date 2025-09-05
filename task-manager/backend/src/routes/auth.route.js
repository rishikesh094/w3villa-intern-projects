import { Router } from "express";
import { register, login, logout } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", register);
router.post("/login", login);
router.post("/logout", logout);

// Protected route example (requires authentication)
router.get("/profile", verifyToken, (req, res) => {
  res.json({ 
    message: "Protected route accessed successfully", 
    user: req.user 
  });
});

export default router;
