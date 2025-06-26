// jobs/lockExpiredBatches.js
const Batch = require("../../models/batch/batch.model");

const lockExpiredBatches = async () => {
  const today = new Date();

  try {
    const expiredBatches = await Batch.find({
      expiryDate: { $lt: today },
      status: 'active',
    });

    for (const batch of expiredBatches) {
      batch.status = 'expired';
      batch.lockedReason = 'Batch expired';
      await batch.save();

      console.log(`[EXPIRED] Batch ${batch.batchCode} locked as expired`);
    }
  } catch (err) {
    console.error("Error locking expired batches:", err);
  }
};

module.exports = lockExpiredBatches;
