const jwt = require("jsonwebtoken");

function auth(req, res, next) {
 

  const token = req.cookies.token;  
  

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  try {
    console.log("jijiji")
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ msg: "Invalid token" });
  }
}

module.exports = auth;
