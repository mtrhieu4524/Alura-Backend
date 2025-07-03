// routes/promotion.routes.js

const express = require('express');
const router = express.Router();
const promoController = require('../../controllers/promotion/promotion.controller');

router.post('/', promoController.createPromotion);
router.get('/available', promoController.getAvailablePromotions);
router.get('/', promoController.getAllPromotions);
router.get('/:id', promoController.getPromotionById);
router.put('/:id', promoController.updatePromotion);
router.delete('/:id', promoController.deletePromotion);
router.get('/usage/:promotionId', promoController.getPromotionUsage);

module.exports = router;
