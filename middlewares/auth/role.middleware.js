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

      // CHUYỂN allowedRoles thành array nếu là string
      const rolesArray = Array.isArray(allowedRoles)
        ? allowedRoles
        : [allowedRoles];

      // Kiểm tra role
      if (!rolesArray.includes(req.user.role)) {
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
const authorizeAdmin = checkRole(["ADMIN"]); 
const authorizeUser = checkRole(["USER"]); 
const authorizeStaff = checkRole(["STAFF"]); 
const authorizeAdminOrStaff = checkRole(["ADMIN", "STAFF"]);

// Xuất các middleware để sử dụng trong các route
module.exports = {
  checkRole,
  authorizeAdmin,
  authorizeUser,
  authorizeStaff,
  authorizeAdminOrStaff,
};
