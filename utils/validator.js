const mongoose = require("mongoose");

const validatorMongooseObjectId = (id) => {
  try {
    return mongoose.Types.ObjectId.isValid(id);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(400, "Internal Server Error");
  }
};

module.exports = { validatorMongooseObjectId };
