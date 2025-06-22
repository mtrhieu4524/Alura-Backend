// utils/checkDependencies.js

/**
 * Check if a document is being referenced in other models.
 * @param {Array} dependencies - Array of objects { model, field, value }
 * @returns {Object|null} - { model: 'ModelName', field: 'field', value } OR null if safe to delete
 */
const checkDependencies = async (dependencies) => {
  for (const { model, field, value } of dependencies) {
    const exists = await model.exists({ [field]: value });
    if (exists) {
      return {
        model: model.modelName,
        field,
        value
      };
    }
  }
  return null; // Safe to delete
};

module.exports = checkDependencies;
