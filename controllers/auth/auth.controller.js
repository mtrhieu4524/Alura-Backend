// controllers/auth/auth.controller.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const User = require("../../models/user/user.model");
const RefreshToken = require("../../models/auth/refreshToken");

//Register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

 
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      phone: "",
      address: "",
      role: "USER",
    };

    
    const validRoles = ["ADMIN", "USER", "STAFF"];
    if (userData.role && !validRoles.includes(userData.role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be ADMIN, USER, or STAFF",
      });
    }

    const newUser = new User(userData);
    await newUser.save();

    
    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || "15m" } 
    );

    // Tạo Refresh Token
    const refreshTokenValue = uuidv4();
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);

    const refreshToken = new RefreshToken({
      token: refreshTokenValue,
      userId: newUser._id,
      expiresAt: refreshTokenExpiry,
    });
    await refreshToken.save();

    const userResponse = {
      accountId: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      address: newUser.address,
      role: newUser.role,
      isActive: newUser.isActive,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      // data: {
      //   accountId: newUser._id,
      //   name: newUser.name,
      //   role: newUser.role,
      //   token,
      //   refreshToken: refreshTokenValue
      // }
    });
  } catch (error) {
    console.error("Register error:", error);

    
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Tìm user theo email
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      isActive: true,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Kiểm tra password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Xóa các refresh token cũ của user này (optional - để tránh tích lũy)
    await RefreshToken.deleteMany({ userId: user._id });

    // Tạo JWT token (Access Token)
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || "15m" } // Giảm thời gian access token
    );

    // Tạo Refresh Token
    const refreshTokenValue = uuidv4();
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7); // 7 ngày

    const refreshToken = new RefreshToken({
      token: refreshTokenValue,
      userId: user._id,
      expiresAt: refreshTokenExpiry,
    });
    await refreshToken.save();

    res.status(200).json({
      accountId: user._id,
      // name: user.name,
      gmail: user.email,
      role: user.role,
      token,
      refreshToken: refreshTokenValue,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//Refresh Token
exports.refreshToken = async (req, res) => {
  try {
    const refreshTokenParam = req.params.refreshToken;

    if (!refreshTokenParam) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required in URL",
      });
    }

    // Tìm token còn hạn
    const storedRefreshToken = await RefreshToken.findOne({
      token: refreshTokenParam,
      expiresAt: { $gt: new Date() },
    }).populate("userId");

    if (!storedRefreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    const user = storedRefreshToken.userId;

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User not found or inactive",
      });
    }

    // Tạo token mới
    const newAccessToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || "15m" }
    );

    // Tạo refresh token mới
    const newRefreshTokenValue = uuidv4();
    const newRefreshTokenExpiry = new Date();
    newRefreshTokenExpiry.setDate(newRefreshTokenExpiry.getDate() + 7);

    // Xóa refresh token cũ
    await RefreshToken.deleteOne({ _id: storedRefreshToken._id });

    // Lưu token mới
    const newRefreshToken = new RefreshToken({
      token: newRefreshTokenValue,
      userId: user._id,
      expiresAt: newRefreshTokenExpiry,
    });
    await newRefreshToken.save();

    // Trả về giống login
    return res.status(200).json({
      accountId: user._id,
      name: user.name,
      role: user.role,
      token: newAccessToken,
      refreshToken: newRefreshTokenValue,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Mật khẩu mới phải có ít nhất 8 ký tự",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        message: "Mật khẩu hiện tại không đúng",
      });
    }

    const saltRounds = 12;
    user.passwordHash = await bcrypt.hash(newPassword, saltRounds);
    await user.save();

    return res.status(200).json({
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    console.error("Lỗi khi đổi mật khẩu:", error);
    return res.status(500).json({
      message: "Lỗi máy chủ. Vui lòng thử lại sau",
    });
  }
};

