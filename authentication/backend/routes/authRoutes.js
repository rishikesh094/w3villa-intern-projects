const express = require("express");
const { registerUser, loginUser, getUser,getMe,logout } = require("../controllers/authController");
const auth = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", auth, getUser);
router.get("/me", auth, getMe); 
router.post("/logout", logout);

module.exports = router;
