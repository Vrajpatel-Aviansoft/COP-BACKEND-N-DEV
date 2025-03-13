const { Op, or } = require('sequelize');

/**
 * Build query options for pagination, ordering, and searching
 * @param {Object} query - Query parameters from the request
 * @param {Array} columns - Columns information
 * @returns {Object} - Sequelize query options
 */
function buildQueryOptions(query) {
  if (!query) {
    return {};
  }
  const { search, start, length, columns } = query;
  const where = {};
  if (search && search.value) {
    const searchConditions = columns
      .filter((c) => c.searchable === 'true')
      .map((c) => {
        if (c.data.includes('.')) {
          return { [`$${c.data}$`]: { [Op.like]: `%${search?.value}%` } };
        }
        return { [c.data]: { [Op.like]: `%${search?.value}%` } };
      });
    if (searchConditions.length > 0) {
      where[Op.or] = [...searchConditions];
    }
  }

  return {
    where,
    order: [['created_at', 'DESC']],
    limit: parseInt(length, 10),
    offset: parseInt(start, 10),
  };
}

const formatQueryResult = (queryResult, query) => {
  if (!query) {
    return { data: queryResult.rows.map((row) => row.dataValues) };
  }
  return JSON.stringify({
    draw: query.draw,
    recordsFiltered: queryResult.count,
    recordsTotal: queryResult.count,
    data: queryResult.rows,
  });
};

module.exports = {
  buildQueryOptions,
  formatQueryResult,
};
