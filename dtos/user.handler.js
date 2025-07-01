const { validatorMongooseObjectId } = require("../utils/validator");
class UserHandler {
  constructor() {}

  getUserById(req, res, next) {
    const validationErrors = [];
    const { userId } = req.params;

    if (!validatorMongooseObjectId(userId)) {
      validationErrors.push({
        field: "userId",
        error: "Invalid user ID format",
      });
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: validationErrors,
      });
    }

    // Proceed with fetching user data
    next();
  }

  updateUserProfile(req, res, next) {
    const validationErrors = [];
    const { userId } = req.params;
    const { name, email, phone, address } = req.body;

    if (!validatorMongooseObjectId(userId)) {
      validationErrors.push({
        field: "userId",
        error: "Invalid user ID format",
      });
    }

    if (!name) {
      validationErrors.push({
        field: "name",
        error: "Name is required",
      });
    }

    if (!email) {
      validationErrors.push({
        field: "email",
        error: "Email is required",
      });
    }

    if (phone && typeof phone !== "string") {
      validationErrors.push({
        field: "phone",
        error: "Phone number must be a string",
      });
    }

    if (address && typeof address !== "string") {
      validationErrors.push({
        field: "address",
        error: "Address must be a string",
      });
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: validationErrors,
      });
    }
    next();
  }
}

module.exports = new UserHandler();
