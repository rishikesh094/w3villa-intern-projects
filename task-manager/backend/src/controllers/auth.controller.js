import bcrypt from "bcrypt";
import User from "../models/user.model.js"
import jwt from "jsonwebtoken"

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role, fullName: user.fullName },
    process.env.JWT_SECRET,
    { expiresIn: "5m" }  // 5 minutes
  );

  const refreshToken = jwt.sign(
    { id: user.id, role: user.role, fullName: user.fullName },
    process.env.JWT_REFRESH,
    { expiresIn: "7d" }  // 7 days
  );

  return { accessToken, refreshToken };
};

export const register = async (req, res) => {
  console.log(req.body);
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exit!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ fullName, email, password: hashedPassword, role });
    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log(req.body);

    if (!email || !password ) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Set access token cookie (5 minutes)
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: "lax",
      maxAge: 5 * 60 * 1000  // 5 minutes in milliseconds
    });

    // Set refresh token cookie (7 days)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days in milliseconds
    });

    res.json({ 
      message: "Login successful", 
      user: { 
        id: user.id, 
        fullName: user.fullName, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};


export const logout = (req, res) => {
  // Clear both cookies
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  
  res.json({ message: "Logged out successfully" });
};
