const Promotion = require('../../models/promotion/promotion.model');
const PromotionUsage = require('../../models/promotion/promotionUsage.model');
const mongoose = require('mongoose');


exports.createPromotion = async (req, res) => {
  try {
    const {
      name,
      description,
      discountValue,
      minimumOrderAmount,
      usageLimit,
      startDate,
      endDate,
      isPublic
    } = req.body;

    if (!name || discountValue == null || !startDate || !endDate) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    if (discountValue <= 0 || discountValue > 100) {
      return res.status(400).json({ message: 'Giá trị giảm phải nằm trong khoảng 1-100%' });
    }

    const newPromo = new Promotion({
      name,
      description,
      discountValue,
      minimumOrderAmount,
      usageLimit,
      startDate,
      endDate,
      isPublic
    });

    await newPromo.save();
    res.status(201).json({ message: 'Tạo khuyến mãi thành công', promotion: newPromo });

  } catch (error) {
    console.error('Lỗi tạo khuyến mãi:', error);
    res.status(500).json({ message: 'Lỗi server khi tạo khuyến mãi' });
  }
};


exports.getAllPromotions = async (req, res) => {
  try {
    const promos = await Promotion.find().sort({ createdAt: -1 });
    res.status(200).json(promos);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách khuyến mãi:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách khuyến mãi' });
  }
};


exports.getAvailablePromotions = async (req, res) => {
  try {
    const now = new Date();

    const promotions = await Promotion.find({
      isPublic: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
      usageLimit: { $gt: 0 },
      $expr: { $lt: ["$usedCount", "$usageLimit"] }
    });

    return res.status(200).json(promotions);
  } catch (error) {
    console.error('Lỗi khi lấy khuyến mãi khả dụng:', error);
    return res.status(500).json({ message: 'Lỗi server khi lấy khuyến mãi khả dụng' });
  }
};



exports.getPromotionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID khuyến mãi không hợp lệ' });
    }

    const promo = await Promotion.findById(id);
    if (!promo) return res.status(404).json({ message: 'Không tìm thấy khuyến mãi' });

    res.status(200).json(promo);
  } catch (error) {
    console.error('Lỗi khi lấy khuyến mãi:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy khuyến mãi' });
  }
};


exports.updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.discountValue != null &&
      (updateData.discountValue <= 0 || updateData.discountValue > 100)) {
      return res.status(400).json({ message: 'Giá trị giảm phải nằm trong khoảng 1-100%' });
    }

    const updatedPromo = await Promotion.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedPromo) {
      return res.status(404).json({ message: 'Không tìm thấy khuyến mãi để cập nhật' });
    }

    res.status(200).json({ message: 'Cập nhật khuyến mãi thành công', promotion: updatedPromo });

  } catch (error) {
    console.error('Lỗi cập nhật khuyến mãi:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật khuyến mãi' });
  }
};


exports.deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;

    const promo = await Promotion.findByIdAndDelete(id);
    if (!promo) return res.status(404).json({ message: 'Không tìm thấy khuyến mãi để xoá' });

    await PromotionUsage.deleteMany({ promotionId: id });

    res.status(200).json({ message: 'Xoá khuyến mãi thành công' });
  } catch (error) {
    console.error('Lỗi xoá khuyến mãi:', error);
    res.status(500).json({ message: 'Lỗi server khi xoá khuyến mãi' });
  }
};


exports.getPromotionUsage = async (req, res) => {
  try {
    const { promotionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(promotionId)) {
      return res.status(400).json({ message: 'ID khuyến mãi không hợp lệ' });
    }

    const usage = await PromotionUsage.find({ promotionId })
      .populate('userId', 'name email')
      .populate('orderId', 'totalAmount orderDate');

    res.status(200).json(usage);
  } catch (error) {
    console.error('Lỗi lấy lịch sử sử dụng khuyến mãi:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy lịch sử sử dụng khuyến mãi' });
  }
};


