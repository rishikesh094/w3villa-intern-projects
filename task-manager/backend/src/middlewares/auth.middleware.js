import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  // If no refresh token, user must login
  if (!refreshToken) {
    return res.status(401).json({ 
      message: "No refresh token provided. Please login.",
      requiresLogin: true 
    });
  }

  // Verify refresh token first (this should always be valid for 7 days)
  jwt.verify(refreshToken, process.env.JWT_REFRESH, (refreshErr, refreshUser) => {
    if (refreshErr) {
      return res.status(403).json({ 
        message: "Invalid or expired refresh token. Please login again.",
        requiresLogin: true 
      });
    }

    // If access token exists and is valid, proceed
    if (accessToken) {
      jwt.verify(accessToken, process.env.JWT_SECRET, (accessErr, accessUser) => {
        if (!accessErr) {
          // Access token is valid, proceed
          req.user = accessUser;
          return next();
        }
        
        // Access token is invalid/expired, generate new one
        console.log('Access token expired, generating new one...');
        generateNewAccessToken(refreshUser, res, req, next);
      });
    } else {
      // No access token, generate new one using refresh token
      console.log('No access token found, generating new one...');
      generateNewAccessToken(refreshUser, res, req, next);
    }
  });
};

// Helper function to generate new access token
const generateNewAccessToken = (user, res, req, next) => {
  const newAccessToken = jwt.sign(
    { id: user.id, role: user.role, fullName: user.fullName },
    process.env.JWT_SECRET,
    { expiresIn: "5m" }
  );

  // Set new access token cookie
  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: false, // Set to true in production with HTTPS
    sameSite: "lax",
    maxAge: 5 * 60 * 1000  // 5 minutes in milliseconds
  });

  // Set user in request and proceed
  req.user = user;
  next();
};
