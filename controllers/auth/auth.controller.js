// controllers/auth/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');

// Đăng ký người dùng mới
exports.register = async (req, res) => {
    try {
      const { name, email, password, phone, address, role } = req.body;

      // Kiểm tra các trường bắt buộc
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Name, email and password are required'
        });
      }

      // Kiểm tra độ dài password
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters long'
        });
      }

      // Kiểm tra email đã tồn tại
      const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email already registered'
        });
      }

      // Mã hóa password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Tạo user mới
      const userData = {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        phone: phone || '',
        address: address || '',
        role: role || 'USER'
      };

      // Kiểm tra role hợp lệ
      const validRoles = ['ADMIN', 'USER', 'STAFF'];
      if (role && !validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role. Must be ADMIN, USER, or STAFF'
        });
      }

      const newUser = new User(userData);
      await newUser.save();

      // Tạo JWT token
      const token = jwt.sign(
        { 
          userId: newUser._id, 
          email: newUser.email, 
          role: newUser.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION || '1d' }
      );

      // Trả về thông tin user (không bao gồm password)
      const userResponse = {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        role: newUser.role,
        isActive: newUser.isActive,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      };

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: userResponse,
          token
        }
      });
   
  } catch (error) {
    console.error('Register error:', error);
    
    // Xử lý lỗi validation của Mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    // Xử lý lỗi duplicate key (email đã tồn tại)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Đăng nhập người dùng
exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;

      // Kiểm tra các trường bắt buộc
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      // Tìm user theo email
      const user = await User.findOne({ 
        email: email.toLowerCase().trim(),
        isActive: true 
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Kiểm tra password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Tạo JWT token
      const token = jwt.sign(
        { 
          userId: user._id, 
          email: user.email, 
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION || '1d' }
      );

      // Trả về thông tin user (không bao gồm password)
      const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: userResponse,
          token
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
};



// Làm mới token (optional)
exports.refreshToken = async (req, res) => {
    try {
      const user = await User.findById(req.user.userId);
      
      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'User not found or inactive'
        });
      }

      // Tạo token mới
      const newToken = jwt.sign(
        { 
          userId: user._id, 
          email: user.email, 
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION || '1d' }
      );

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: { token: newToken }
      });

    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
};