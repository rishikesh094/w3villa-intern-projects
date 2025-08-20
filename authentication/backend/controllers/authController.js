const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.json({ msg: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

   res.cookie("token", token, {
      httpOnly: true, 
      sameSite: "strict"
    });

    res.json({ message: "Login successful", user: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getUser = async (req, res) => {
  const token = req.cookies.token;
  // console.log(token);
  
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("hiihih")
    res.json({ message: "Access granted", userId: decoded.id });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}
