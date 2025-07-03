//middlewares/auth/auth.middleware.js
const jwt = require("jsonwebtoken");
const User = require("../../models/user/user.model");

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    // Fallback to session token if available
    if (!token && req.session && req.session.token) {
      token = req.session.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    // Remove Bearer prefix if present
    if (token.startsWith("Bearer ")) {
      token = token.replace("Bearer ", "");
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-passwordHash");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User account is inactive",
      });
    }

    console.log("Authenticated user:", user);

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    // Handle specific JWT errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token expired",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = authMiddleware;
