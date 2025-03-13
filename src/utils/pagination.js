/**
 * Generates pagination metadata and data slice for a given dataset using Sequelize.
 * @param {Object} model - The Sequelize model to query.
 * @param {Object} options - Options for pagination including page, pageSize, where, and order.
 * @returns {Object} An object containing paginated data and metadata.
 */
const Paginate = async (
  model,
  { page = 1, pageSize = 10, where = {}, order = [] }
) => {
  try {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    const { count: totalItems, rows: results } = await model.findAndCountAll({
      where,
      order,
      offset,
      limit,
    });
    return {
      data: results,
      recordsFiltered: totalItems,
      recordsTotal: totalItems,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = Paginate;
