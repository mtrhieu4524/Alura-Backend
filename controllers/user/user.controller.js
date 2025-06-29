const User = require("../../models/user/user.model");

class userController {
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
}

module.exports = new userController();
