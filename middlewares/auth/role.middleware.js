// middleware/role.middleware.js

// Định nghĩa hàm checkRole trước
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // Kiểm tra xem req.user có tồn tại không
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized. User not authenticated.",
        });
      }

      // Kiểm tra role
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied. Insufficient permissions.",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
};

// Middleware cho vai trò ADMIN, USER, STAFF
const authorizeAdmin = checkRole("ADMIN");
const authorizeUser = checkRole("USER");
const authorizeStaff = checkRole("STAFF");
const authorizeAdminOrStaff = checkRole(["ADMIN", "STAFF"]);

// Xuất các middleware để sử dụng trong các route
module.exports = {
  checkRole,
  authorizeAdmin,
  authorizeUser,
  authorizeStaff,
  authorizeAdminOrStaff,
};
