// middleware/role.middleware.js

// Định nghĩa hàm checkRole trước
function checkRole(requiredRole) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ message: 'Forbidden: Access denied' });
    }
    next();
  };
}

// Middleware cho vai trò ADMIN, USER, STAFF
const authorizeAdmin = checkRole('ADMIN');
const authorizeUser = checkRole('USER');
const authorizeStaff = checkRole('STAFF');

// Xuất các middleware để sử dụng trong các route
module.exports = {
  checkRole,
  authorizeAdmin,
  authorizeUser,
  authorizeStaff
};
