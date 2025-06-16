const jwt = require("jsonwebtoken");
const User = require("../../models/user/user");

const authMiddleware = async  (req, res, next) => {
  let token = req.header("Authorization");

  if (!token && req.session && req.session.token) {
    token = req.session.token; 
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  if (token.startsWith("Bearer ")) {
    token = token.replace("Bearer ", "");
  }

  try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
  const user = await User.findById(decoded.userId).select("-passwordHash");
  if (!user) {
    return res.status(401).json({ message: "Unauthorized: User not found" });
  }
  req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = authMiddleware;
