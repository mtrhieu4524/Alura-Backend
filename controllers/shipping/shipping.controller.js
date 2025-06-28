// controllers/shipping.controller.js
const Shipping = require('../../models/shipping/shipping.model');
const Order = require('../../models/order/order.model');
const mongoose = require('mongoose');

// Cập nhật trạng thái đơn giao hàng
exports.updateShippingStatus = async (req, res) => {
  try {
    const { shippingId } = req.params;
    const { deliveryStatus } = req.body;
    const userId = req.user._id; //staff

    if (!['Pending', 'Shipping', 'Delivered', 'Failed'].includes(deliveryStatus)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    }

    const shipping = await Shipping.findById(shippingId);
    if (!shipping) {
      return res.status(404).json({ message: 'Không tìm thấy đơn giao hàng' });
    }

    // Nếu là Delivered thì set ngày giao hàng
    const updateData = {
      deliveryStatus,
      handledBy: userId,
    };

    if (deliveryStatus === 'Delivered') {
      updateData.deliveryDate = new Date();
    }

    const updated = await Shipping.findByIdAndUpdate(
      shippingId,
      { $set: updateData },
      { new: true }
    ).populate('orderId');

    res.status(200).json({
      message: 'Cập nhật trạng thái giao hàng thành công',
      shipping: updated
    });

  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật trạng thái giao hàng' });
  }
};

// Lấy chi tiết giao hàng kèm trạng thái đơn
exports.getShippingDetail = async (req, res) => {
  try {
    const { shippingId } = req.params;

    const shipping = await Shipping.findById(shippingId)
      .populate('orderId')
      .populate('handledBy', 'name email');

    if (!shipping) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin vận chuyển' });
    }

    res.status(200).json({ shipping });
  } catch (error) {
    console.error('Lỗi lấy thông tin vận chuyển:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
