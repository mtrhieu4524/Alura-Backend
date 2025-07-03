const User = require("../../models/user/user.model");
const bcrypt = require("bcryptjs");

class userController {
  async getAllUsers(req, res) {
    const { searchByEmail, searchByName } = req.query;
    try {
      const users = await User.find(
        {
          ...(searchByEmail && {
            email: { $regex: searchByEmail, $options: "i" },
          }),
          ...(searchByName && {
            name: { $regex: searchByName, $options: "i" },
          }),
        },
        "name email phone address role"
      )
        .populate("role", "name")
        .exec();

      res.status(200).json({
        success: true,
        users: users.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
        })),
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async getUserById(req, res) {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId); // Populate role details
      res.status(200).json({
        success: true,
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateUserProfile(req, res) {
    try {
      const { userId } = req.params;
      const { name, email, phone, address } = req.body;

      const user = await User.findByIdAndUpdate(
        userId,
        {
          name,
          email,
          phone,
          address,
        },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        success: true,
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
        },
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async changePassword(req, res) {
    try {
      const { userId } = req.params;
      const { oldPassword, newPassword } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect old password" });
      }

      user.passwordHash = await bcrypt.hash(newPassword, 10);
      await user.save();

      res
        .status(200)
        .json({ success: true, message: "Password updated successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new userController();
